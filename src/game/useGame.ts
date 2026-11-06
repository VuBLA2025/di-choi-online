import { useEffect, useRef, useState } from 'react';
import { useLiveEvents } from '../live/useLiveEvents';
import type { GiftEvent, LiveStatus } from '../live/types';
import { voice, speakableName } from '../live/voice';
import { music } from '../live/music';
import { containsBanned } from '../live/bannedWords';
import { NameBatcher } from '../live/scoreboard';
import { GiftThanker, OncePerPerson } from '../live/chatter';
import { IS_STAGE } from '../live/page';
import { GAME } from './config';
import { fetchGameSettings } from './gameSettings';
import { Trip, type Say, type StageView } from './trip';
import { sfx } from './sfx';

// ?view=stage&mute=1: xem thử trang stage không phát tiếng
const MUTED = new URLSearchParams(window.location.search).get('mute') === '1';

export type { StageView };

/**
 * Trang stage chạy game thật (lõi ở trip.ts).
 * Trang điều khiển không tự chạy game: nó chỉ nhận trạng thái qua SSE để hiện
 * thông tin điều khiển (chuyến/điểm đến/đố vui) trong GameControls. Panel KHÔNG có
 * xem trước, game thật chỉ chạy ở trang stage riêng.
 */
export function useGame() {
  const [status, setStatus] = useState<LiveStatus | null>(null);
  const [view, setView] = useState<StageView | null>(null);
  const [lastGift, setLastGift] = useState<(GiftEvent & { at: number }) | null>(null);
  const [stageCount, setStageCount] = useState(0);
  const [channelName, setChannelName] = useState(GAME.defaultChannelName);

  const roomRef = useRef<Trip | null>(null);
  const likeBase = useRef<number | null>(null);
  const dirty = useRef(true);

  const [talk] = useState(() => ({
    greeter: new NameBatcher(
      GAME.greetEveryMs,
      GAME.namesPerGreeting,
      (names) => roomRef.current && say([{ text: `Chào ${joinNames(names)} mới lên xe! Gõ đi chơi để vào đoàn đi nào.` }]),
      () => chatter.current.length >= 2,
    ),
    gifts: new GiftThanker(GAME.giftThanksCooldownMs, GAME.bigGiftCoins),
    follows: new OncePerPerson(),
    shares: new OncePerPerson(),
  }));

  const mainSpeaking = useRef(0);
  const chatter = useRef<{ text: string; priority: boolean; until: number }[]>([]);
  function say(lines: Say[]) {
    const now = Date.now();
    for (const l of lines) {
      if (l.main) {
        mainSpeaking.current++;
        voice.say(l.text, true, () => mainSpeaking.current--);
      } else if (l.warn) {
        voice.say(l.text, true);
      } else {
        const ttl = l.ttl ?? (l.priority ? GAME.giftLineMaxWaitMs : GAME.chatterMaxWaitMs);
        chatter.current.push({ text: l.text, priority: !!l.priority, until: now + ttl });
      }
    }
    dirty.current = true;
  }
  function flushChatter(room: Trip, now: number) {
    chatter.current = chatter.current.filter((c) => c.until > now);
    if (voice.busy || mainSpeaking.current > 0 || !room.chatterWindow(now)) return;
    const i = Math.max(0, chatter.current.findIndex((c) => c.priority));
    const next = chatter.current.splice(i, 1)[0];
    if (next) voice.say(next.text);
  }

  const person = (e: { nickname: string; username: string; avatar: string }) => {
    const nickname = containsBanned(e.nickname) ? e.username : e.nickname;
    return { username: e.username, nickname, spoken: speakableName(nickname), avatar: e.avatar };
  };

  useLiveEvents({
    onStatus: setStatus,
    onSpeaker: (d) => setStageCount(d.count),
    onGameState: (s) => {
      if (!IS_STAGE) setView(s as StageView);
    },
    onSettings: () => {
      if (!IS_STAGE) return;
      fetchGameSettings()
        .then(() => {
          talk.gifts.update(GAME.giftThanksCooldownMs, GAME.bigGiftCoins);
          music.setVolume(GAME.musicVolume);
        })
        .catch(() => {});
    },
    onChat: (e) => {
      const room = roomRef.current;
      if (!room) return;
      const p = person(e);
      const isNew = !room.players.has(e.username);
      say(room.chat({ ...p }, e.comment, Date.now()));
      if (isNew && p.spoken !== 'bạn') talk.greeter.add(e.username, p.spoken);
    },
    onGift: (e) => {
      const room = roomRef.current;
      if (!room) return;
      const p = person(e);
      const coins = e.diamondCount * e.repeatCount;
      setLastGift({ ...e, nickname: p.nickname, at: Date.now() });
      const lines = room.gift(p, coins, e.giftName, Date.now());
      say(lines);
      if (!lines.length && talk.gifts.shouldThank(e.username, coins, chatter.current.filter((c) => c.priority).length)) {
        say([{ text: `Cảm ơn bạn ${p.spoken} đã tặng quà!`, priority: true }]);
      }
    },
    onFollow: (e) => {
      const room = roomRef.current;
      if (room && talk.follows.first(e.username)) say(room.follow(person(e), Date.now()));
    },
    onShare: (e) => {
      const room = roomRef.current;
      if (room && talk.shares.first(e.username)) say(room.share(person(e), Date.now()));
    },
    onLike: (e) => {
      const room = roomRef.current;
      if (!room) return;
      if (likeBase.current === null) likeBase.current = e.totalLikes - e.likeCount;
      say(room.like(e.likeCount, Date.now()));
    },
    onControl: (c) => {
      if (c.action === 'setName' && c.text) setChannelName(c.text);
      const room = roomRef.current;
      if (!room) return;
      if (c.action === 'speak' && c.text) voice.say(c.text, true);
      if (c.action === 'setRate' && c.text) voice.rate = Number(c.text) || 1;
      if (c.action === 'reset' || (c.action === 'custom' && c.text === 'newJourney')) {
        voice.stop();
        chatter.current = [];
        say(room.newJourney(Date.now()));
      }
      if (c.action === 'custom' && c.text === 'skip') say(room.skip(Date.now()));
      if (c.action === 'custom' && c.text === 'golden') say(room.forceGolden(Date.now()));
    },
  });

  useEffect(() => {
    if (!IS_STAGE) return;
    if (MUTED) {
      voice.volume = 0;
      sfx.volume = 0;
      music.setVolume(0);
    }
    sfx.loadFiles();
    let prevView: StageView | null = null;
    let stop = false;
    const timers: ReturnType<typeof setInterval>[] = [];

    // Nhạc nền: chỉ bắt đầu sau 1 lần chạm lên stage (trình duyệt cấm tự phát tiếng)
    const unlockMusic = () => music.start();
    window.addEventListener('pointerdown', unlockMusic, { once: true });
    (window as unknown as { __dichoiMusic?: unknown }).__dichoiMusic = music;
    (window as unknown as { __dichoiVoice?: unknown }).__dichoiVoice = voice;

    (async () => {
      try {
        await fetchGameSettings();
        talk.gifts.update(GAME.giftThanksCooldownMs, GAME.bigGiftCoins);
        music.setVolume(GAME.musicVolume);
      } catch {
        // giữ mặc định trong config.ts
      }
      if (stop) return;
      const room = new Trip(Date.now());
      roomRef.current = room;
      say(room.opening);

      let lastSent = 0;
      let lastTick = Date.now();
      timers.push(
        setInterval(() => {
          const now = Date.now();
          if (mainSpeaking.current > 0) {
            room.hold(now - lastTick);
            dirty.current = true;
          }
          lastTick = now;
          say(room.tick(now));
          flushChatter(room, now);
          sfx.clock(room.phase, true, room.phaseEndsAt, now);
          music.update(voice.busy || mainSpeaking.current > 0);
          if (!dirty.current && now - lastSent < 1000) return;
          dirty.current = false;
          const v = room.view(now);
          sfx.watch(prevView, v);
          prevView = v;
          setView(v);
          if (now - lastSent >= 400) {
            lastSent = now;
            fetch('/api/game/state', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v) }).catch(() => {});
          }
        }, 200),
        setInterval(() => say(room.shareReminder(Date.now())), GAME.shareReminderEveryMs),
        setInterval(() => say(room.idle(Date.now())), 30_000),
        setInterval(() => say(room.likeReminder(Date.now())), 60_000),
        setInterval(() => say(room.giftReminder(Date.now())), 60_000),
        setInterval(() => {
          fetchGameSettings()
            .then(() => {
              talk.gifts.update(GAME.giftThanksCooldownMs, GAME.bigGiftCoins);
              music.setVolume(GAME.musicVolume);
            })
            .catch(() => {});
        }, 60_000),
      );
    })();

    return () => {
      stop = true;
      timers.forEach(clearInterval);
      window.removeEventListener('pointerdown', unlockMusic);
      music.stop();
    };
  }, []);

  return { status, view, lastGift, stageCount, channelName };
}

export type GameState = ReturnType<typeof useGame>;

function joinNames(names: string[]) {
  const spoken = names.map((n) => `bạn ${n}`);
  return spoken.length > 1 ? `${spoken.slice(0, -1).join(', ')} và ${spoken[spoken.length - 1]}` : spoken[0] ?? '';
}
