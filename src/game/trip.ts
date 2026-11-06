// Lõi game Đi Chơi Online — du lịch chill cùng nhau. Hàm thuần + class, không React.
// Trang stage chạy game thật ở đây; trang điều khiển chỉ vẽ lại ảnh chụp.
// KHÔNG có đội thắng thua: cả đoàn đi cùng nhau qua 8 điểm đến x 10 điểm dừng.
import { GAME } from './config';
import { DESTINATIONS } from './destinations';
import { QUIZ, type QuizQ } from './quiz';
import { MC } from './loi-thoai';
import { plain } from '../live/chatter';

export interface Say {
  text: string;
  main?: boolean; // câu chính: đọc ngay, đồng hồ dừng trong lúc đọc
  warn?: boolean; // nhắc sắp hết giờ: đọc liền, đồng hồ vẫn chạy
  priority?: boolean; // cảm ơn quà: chen lên đầu hàng chờ
  ttl?: number; // câu nói thêm chờ tối đa chừng này ms
  go?: boolean;
}

export type Phase = 'arrive' | 'visit' | 'celebrate';

export const PHASE_LABEL: Record<Phase, string> = {
  arrive: 'Tới nơi',
  visit: 'Tham quan',
  celebrate: 'Tổng kết điểm đến',
};

export interface Person {
  username: string;
  nickname: string;
  spoken: string;
  avatar: string;
}

export interface Player extends Person {
  joined: boolean;
  points: number;
  diamonds: number;
  lastActive: number;
  votedStop: string; // "vòng-điểm đến-điểm dừng" đã vote
  quizAnswered: string; // key điểm dừng đã trả lời đố vui
  bubble: string;
  bubbleUntil: number;
}

export interface FeedItem {
  at: number;
  text: string;
  kind: 'join' | 'points' | 'gift' | 'vote' | 'quiz' | 'golden' | 'dest' | 'info';
}

export interface SeatPlayer {
  username: string;
  nickname: string;
  avatar: string;
  points: number;
  bubble: string;
  bubbleUntil: number;
  isGuide: boolean;
}

export interface StageView {
  journey: number;
  destIndex: number;
  destName: string;
  destEmoji: string;
  destTagline: string;
  destsTotal: number;
  stopIndex: number;
  stopName: string;
  stopEmoji: string;
  stopStory: string;
  stopsTotal: number;
  phase: Phase;
  phaseLabel: string;
  phaseEndsAt: number;
  phaseLeftSec: number;
  likes: number;
  likesTarget: number;
  giftGoal: { xu: number; target: number };
  golden: boolean;
  nextGolden: boolean;
  vote: { options: { id: string; label: string; count: number }[]; total: number };
  quiz: { q: string; qNo: number; total: number; revealed: boolean; answer: string; correctCount: number; correctNames: string[] };
  travellers: SeatPlayer[];
  top: { nickname: string; points: number }[];
  topGifters: { nickname: string; diamonds: number }[];
  events: FeedItem[];
  spotlight: { nickname: string; kind: 'guide' | 'flag' | 'spotlight'; until: number } | null;
  flagHolder: string;
  flagDest: string;
  flowers: boolean;
  fireworks: boolean;
  stars: boolean;
  panorama: boolean;
  polaroid: boolean;
  players: number;
  banner: { text: string; until: number } | null;
  musicFlip: number;
}

const rand = (n: number) => Math.floor(Math.random() * n);

export class Trip {
  players = new Map<string, Player>();
  journey = 1;
  destIndex = 0;
  stopIndex = 0;
  phase: Phase = 'arrive';
  phaseStartedAt = 0;
  phaseEndsAt = 0;
  likesThisStop = 0;
  giftXuToday = 0;
  currentGolden = false;
  nextGolden = false;
  spotlight: StageView['spotlight'] = null;
  flagHolder = '';
  flagDest = '';
  flowersUntil = 0;
  fireworksUntil = 0;
  starsUntil = 0;
  panoramaUntil = 0;
  polaroidUntil = 0;
  musicFlip = 0;
  banner: StageView['banner'] = null;
  events: FeedItem[] = [];
  voteCounts: Record<string, number> = {};
  quizIndex = 0;
  quiz: QuizQ = QUIZ[0];
  quizEndsAt = 0;
  quizCorrect: { nickname: string }[] = [];
  quizRevealed = false;
  usedQuiz = new Set<number>();
  lastShareAt = 0;
  lastIdleAt = 0;
  lastLikeReminderAt = 0;
  lastGiftReminderAt = 0;

  opening: Say[] = [];
  constructor(now: number) {
    this.opening = this.startStop(now, true);
  }

  // ---------- điểm đến / điểm dừng ----------
  private dest() {
    return DESTINATIONS[this.destIndex];
  }
  private stop() {
    return this.dest().stops[this.stopIndex];
  }
  private stopKey() {
    return `${this.journey}-${this.destIndex}-${this.stopIndex}`;
  }

  private ensurePlayer(p: Person, now: number): Player {
    let pl = this.players.get(p.username);
    if (!pl) {
      pl = {
        ...p,
        joined: false,
        points: 0,
        diamonds: 0,
        lastActive: now,
        votedStop: '',
        quizAnswered: '',
        bubble: '',
        bubbleUntil: 0,
      };
      this.players.set(p.username, pl);
    } else {
      pl.nickname = p.nickname;
      pl.avatar = p.avatar || pl.avatar;
      pl.lastActive = now;
    }
    return pl;
  }
  private joinTrip(pl: Player, now: number): Say[] {
    if (pl.joined) return [];
    pl.joined = true;
    this.feed(`${pl.nickname} lên xe đi chơi cùng cả đoàn`, 'join', now);
    return [{ text: MC.joinTrip(pl.spoken) }];
  }

  private mult(now: number) {
    return this.currentGolden ? 2 : 1;
  }

  private feed(text: string, kind: FeedItem['kind'], now: number) {
    this.events.push({ at: now, text, kind });
    if (this.events.length > 8) this.events.splice(0, this.events.length - 8);
  }

  // ---------- bắt đầu 1 điểm dừng ----------
  private startStop(now: number, first = false): Say[] {
    const d = this.dest();
    const s = this.stop();
    this.currentGolden = this.nextGolden;
    this.nextGolden = false;
    this.likesThisStop = 0;
    this.voteCounts = {};
    this.quizCorrect = [];
    this.quizRevealed = false;
    this.nextQuiz(now);
    this.phase = 'arrive';
    this.phaseStartedAt = now;
    this.phaseEndsAt = now + GAME.phaseSec.arrive * 1000;
    const lines: Say[] = [];
    if (first) {
      lines.push({ text: MC.journeyStart(d.name), main: true });
    }
    lines.push({ text: this.currentGolden ? MC.arriveGolden(s.name, s.story) : MC.arrive(s.name, s.story), main: true });
    return lines;
  }

  private nextQuiz(now: number) {
    let qi = rand(QUIZ.length);
    for (let i = 0; i < 20 && this.usedQuiz.has(qi); i++) qi = rand(QUIZ.length);
    this.usedQuiz.add(qi);
    if (this.usedQuiz.size > QUIZ.length - 3) this.usedQuiz.clear();
    this.quiz = QUIZ[qi];
    this.quizCorrect = [];
    this.quizRevealed = false;
    this.quizEndsAt = now + 60_000;
  }

  /** Đi điểm dừng tiếp theo (đủ tim / hết giờ / panel bấm qua). */
  private advance(now: number): Say[] {
    const lines: Say[] = [];
    // Chốt vote ở điểm vừa rời
    const topOpt = GAME.voteOptions.reduce((best, o) => ((this.voteCounts[o.id] ?? 0) > (this.voteCounts[best.id] ?? 0) ? o : best), GAME.voteOptions[0]);
    if ((this.voteCounts[topOpt.id] ?? 0) > 0) lines.push({ text: MC.voteResult(topOpt.label) });
    if (this.stopIndex < this.dest().stops.length - 1) {
      this.stopIndex++;
      const next = this.stop();
      lines.push({ text: MC.nextStop(next.name), main: true });
      lines.push(...this.startStop(now));
      return lines;
    }
    // Hết 1 điểm đến: tổng kết rồi sang điểm đến mới
    this.phase = 'celebrate';
    this.phaseStartedAt = now;
    this.phaseEndsAt = now + GAME.phaseSec.celebrate * 1000;
    const d = this.dest();
    const nextDest = DESTINATIONS[(this.destIndex + 1) % DESTINATIONS.length];
    const isLastDest = this.destIndex === DESTINATIONS.length - 1;
    this.banner = { text: `🎉 Xong ${d.name}! Cả đoàn đi hết 10 điểm!`, until: this.phaseEndsAt };
    this.feed(`Xong điểm đến ${d.name} — sang ${nextDest.name}`, 'dest', now);
    lines.push({
      text: isLastDest ? MC.journeyComplete(nextDest.name) : MC.destComplete(d.name, nextDest.name),
      main: true,
    });
    return lines;
  }

  private nextDestination(now: number): Say[] {
    if (this.destIndex === DESTINATIONS.length - 1) {
      this.journey++;
      this.destIndex = 0;
    } else {
      this.destIndex++;
    }
    this.stopIndex = 0;
    this.flagHolder = '';
    this.flagDest = '';
    this.banner = null;
    return this.startStop(now);
  }

  private advancePhase(now: number): Say[] {
    switch (this.phase) {
      case 'arrive':
        this.phase = 'visit';
        this.phaseStartedAt = now;
        this.phaseEndsAt = now + GAME.phaseSec.visit * 1000;
        return [];
      case 'visit':
        return [ { text: MC.visitTimeout(this.stop().name) }, ...this.advance(now) ];
      case 'celebrate':
        return this.nextDestination(now);
    }
  }

  skip(now: number): Say[] {
    if (this.phase === 'celebrate') return this.nextDestination(now);
    return this.advance(now);
  }

  newJourney(now: number): Say[] {
    this.journey++;
    this.destIndex = 0;
    this.stopIndex = 0;
    this.likesThisStop = 0;
    this.giftXuToday = 0;
    this.currentGolden = false;
    this.nextGolden = false;
    this.spotlight = null;
    this.flagHolder = '';
    this.flagDest = '';
    this.banner = null;
    for (const p of this.players.values()) {
      p.points = 0;
      p.diamonds = 0;
    }
    return this.startStop(now, true);
  }

  /** Dừng đồng hồ trong lúc MC đọc câu chính */
  hold(ms: number) {
    this.phaseEndsAt += ms;
    if (this.quizEndsAt) this.quizEndsAt += ms;
  }

  // ---------- nhịp game ----------
  tick(now: number): Say[] {
    const lines: Say[] = [];
    if ((this.phase === 'arrive' || this.phase === 'visit') && !this.quizRevealed && this.quizEndsAt && now >= this.quizEndsAt) {
      this.quizRevealed = true;
      lines.push({ text: MC.quizReveal(this.quiz.show), main: true });
    }
    if (this.phase === 'visit' && this.likesThisStop >= GAME.likesPerStop) {
      lines.push(...this.advance(now));
      return lines;
    }
    if (now >= this.phaseEndsAt) lines.push(...this.advancePhase(now));
    return lines;
  }

  chatterWindow(now: number) {
    return (this.phase === 'arrive' || this.phase === 'visit') && this.phaseEndsAt - now > GAME.chatterMinLeftMs;
  }

  idle(now: number): Say[] {
    if (now - this.lastIdleAt < GAME.idleAfterSec * 1000) return [];
    this.lastIdleAt = now;
    return [{ text: MC.idle() }];
  }

  shareReminder(now: number): Say[] {
    if (now - this.lastShareAt < GAME.shareReminderEveryMs) return [];
    this.lastShareAt = now;
    return [{ text: MC.shareReminder() }];
  }

  likeReminder(now: number): Say[] {
    if (this.phase !== 'visit') return [];
    if (now - this.lastLikeReminderAt < 5 * 60_000) return [];
    this.lastLikeReminderAt = now;
    return [{ text: MC.likeReminder() }];
  }

  giftReminder(now: number): Say[] {
    if (now - this.lastGiftReminderAt < 5 * 60_000) return [];
    this.lastGiftReminderAt = now;
    return [{ text: MC.giftReminder() }];
  }

  // ---------- sự kiện TikTok ----------
  chat(p: Person, comment: string, now: number): Say[] {
    const pl = this.ensurePlayer(p, now);
    const t = plain(comment);
    const lines: Say[] = [];
    if (!pl.joined) {
      if (GAME.joinKeywords.some((k) => t.includes(plain(k)))) lines.push(...this.joinTrip(pl, now));
      else return lines; // chưa lên xe: chưa tính điểm, MC không nói (tránh spam)
    }
    pl.bubble = comment.slice(0, 40);
    pl.bubbleUntil = now + GAME.bubbleMs;

    if (this.phase === 'arrive' || this.phase === 'visit') {
      // Vote 1/2/3: mỗi người 1 lần mỗi điểm dừng
      const opt = GAME.voteOptions.find((o) => t.trim() === o.id);
      if (opt && pl.votedStop !== this.stopKey()) {
        pl.votedStop = this.stopKey();
        this.voteCounts[opt.id] = (this.voteCounts[opt.id] ?? 0) + 1;
        const pts = GAME.votePts * this.mult(now);
        pl.points += pts;
        this.feed(`${pl.nickname} vote ${opt.label} (+${pts} điểm)`, 'vote', now);
        return lines;
      }
      // Đố vui ở điểm dừng
      if (!this.quizRevealed && pl.quizAnswered !== this.stopKey()) {
        const tt = ` ${t.trim()} `;
        const ok = this.quiz.a.some((a) => tt.includes(` ${a} `));
        if (ok) {
          pl.quizAnswered = this.stopKey();
          this.quizCorrect.push({ nickname: pl.nickname });
          const pts = GAME.quizPts * this.mult(now);
          pl.points += pts;
          this.feed(`${pl.nickname} trả lời đúng +${pts} điểm`, 'quiz', now);
          lines.push({ text: MC.quizCorrect(pl.spoken), priority: true });
          if (this.quizCorrect.length >= GAME.quizWinners) {
            this.quizEndsAt = now + 3000; // đủ người đúng: 3 giây sau công bố
          }
          return lines;
        }
      }
    }
    return lines;
  }

  gift(p: Person, coins: number, giftName: string, now: number): Say[] {
    if (coins <= 0) return [];
    const pl = this.ensurePlayer(p, now);
    if (!pl.joined) this.joinTrip(pl, now);
    const g = plain(giftName);
    const isRose = g.includes('hoa hong') || g.includes('rose');
    const isTicket = g.includes('travel ticket') || g.includes('ve du lich') || g.includes('ticket');
    const isGalaxy = g.includes('galaxy') || g.includes('thien ha');
    let pts = 0;
    if (coins >= 99) pts = GAME.giftPts99;
    else if (coins >= 20) pts = GAME.giftPts20;
    else if (coins >= 10) pts = GAME.giftPts10;
    else if (coins >= 5) pts = GAME.giftPts5;
    else pts = GAME.giftPts1;
    if (isRose) pts = Math.max(pts, GAME.namedGiftPtsRose);
    if (isTicket) pts = Math.max(pts, GAME.namedGiftPtsTicket);
    if (isGalaxy) pts = Math.max(pts, GAME.namedGiftPtsGalaxy);
    pts *= this.mult(now);
    pl.points += pts;
    pl.diamonds += coins;
    this.giftXuToday += coins;
    this.feed(`${pl.nickname} tặng ${coins} xu (+${pts} điểm)`, 'gift', now);
    const lines: Say[] = [];
    if (isRose) {
      this.flowersUntil = now + 30_000;
      lines.push({ text: MC.rose(pl.spoken) });
    }
    if (isTicket) {
      this.panoramaUntil = now + 30_000;
      this.musicFlip++;
      lines.push({ text: MC.ticket(pl.spoken) });
    }
    if (isGalaxy) {
      this.starsUntil = now + 30_000;
      lines.push({ text: MC.galaxy(pl.spoken), main: true });
    }
    if (coins >= 1 && coins < 5) {
      this.polaroidUntil = now + 15_000;
      lines.push({ text: MC.polaroid(pl.spoken), priority: true });
    }
    if (coins >= 5 && coins < 10) lines.push({ text: MC.dish(pl.spoken), priority: true });
    if (coins >= 10 && coins < 20) {
      this.fireworksUntil = now + 30_000;
      lines.push({ text: MC.sunset(pl.spoken), main: true });
    }
    if (coins >= 20 && coins < 99) {
      this.spotlight = { nickname: pl.nickname, kind: 'guide', until: now + GAME.guideSec * 1000 };
      lines.push({ text: MC.guide(pl.spoken, GAME.guideSec), main: true });
    }
    if (coins >= 99 && coins < 199) {
      this.spotlight = { nickname: pl.nickname, kind: 'flag', until: this.phaseEndsAt };
      this.flagHolder = pl.nickname;
      this.flagDest = this.dest().name;
      lines.push({ text: MC.flag(pl.spoken, this.dest().name), main: true });
    }
    if (coins >= 199) {
      this.spotlight = { nickname: pl.nickname, kind: 'spotlight', until: now + 60_000 };
      this.banner = { text: `✨ Ngôi sao chuyến đi: ${pl.nickname}!`, until: now + 60_000 };
      lines.push({ text: MC.giftBig(pl.spoken, coins), main: true });
    }
    if (!lines.length) {
      lines.push(coins >= GAME.bigGiftCoins ? { text: MC.giftBig(pl.spoken, coins), main: true } : { text: MC.giftSmall(pl.spoken), priority: true });
    } else if (coins >= GAME.bigGiftCoins && !lines.some((l) => l.main)) {
      lines.unshift({ text: MC.giftBig(pl.spoken, coins), main: true });
    }
    // Đủ mục tiêu quà cả đoàn → điểm dừng tiếp theo thành Điểm Vàng (điểm x2)
    if (this.giftXuToday >= GAME.giftGoalXu) {
      this.giftXuToday = 0;
      this.nextGolden = true;
      lines.push({ text: MC.giftGoal(GAME.giftGoalXu), main: true });
    }
    return lines;
  }

  follow(p: Person, now: number): Say[] {
    const pl = this.ensurePlayer(p, now);
    if (!pl.joined) this.joinTrip(pl, now);
    return [{ text: MC.follow(pl.spoken) }];
  }

  share(p: Person, now: number): Say[] {
    const pl = this.ensurePlayer(p, now);
    return [{ text: MC.share(pl.spoken) }];
  }

  like(likeCount: number, now: number): Say[] {
    this.likesThisStop += likeCount;
    return [];
  }

  forceGolden(now: number): Say[] {
    this.nextGolden = true;
    return [{ text: MC.giftGoal(GAME.giftGoalXu), main: true }];
  }

  // ---------- ảnh chụp cho stage ----------
  view(now: number): StageView {
    const d = this.dest();
    const s = this.stop();
    const travellers: SeatPlayer[] = [...this.players.values()]
      .filter((p) => p.joined)
      .sort((a, b) => b.points - a.points || b.lastActive - a.lastActive)
      .slice(0, GAME.seatsShown)
      .map((p) => ({
        username: p.username,
        nickname: p.nickname,
        avatar: p.avatar,
        points: p.points,
        bubble: p.bubbleUntil > now ? p.bubble : '',
        bubbleUntil: p.bubbleUntil,
        isGuide: this.spotlight?.kind === 'guide' && this.spotlight.nickname === p.nickname && this.spotlight.until > now,
      }));
    const joined = [...this.players.values()].filter((p) => p.joined);
    const top = [...joined]
      .sort((a, b) => b.points - a.points)
      .slice(0, GAME.topKept)
      .map((p) => ({ nickname: p.nickname, points: p.points }));
    const topGifters = [...joined]
      .filter((p) => p.diamonds > 0)
      .sort((a, b) => b.diamonds - a.diamonds)
      .slice(0, 3)
      .map((p) => ({ nickname: p.nickname, diamonds: p.diamonds }));
    return {
      journey: this.journey,
      destIndex: this.destIndex,
      destName: d.name,
      destEmoji: d.emoji,
      destTagline: d.tagline,
      destsTotal: DESTINATIONS.length,
      stopIndex: this.stopIndex,
      stopName: s.name,
      stopEmoji: s.emoji,
      stopStory: s.story,
      stopsTotal: d.stops.length,
      phase: this.phase,
      phaseLabel: PHASE_LABEL[this.phase],
      phaseEndsAt: this.phaseEndsAt,
      phaseLeftSec: Math.max(0, Math.ceil((this.phaseEndsAt - now) / 1000)),
      likes: this.likesThisStop,
      likesTarget: GAME.likesPerStop,
      giftGoal: { xu: this.giftXuToday, target: GAME.giftGoalXu },
      golden: this.currentGolden,
      nextGolden: this.nextGolden,
      vote: {
        options: GAME.voteOptions.map((o) => ({ id: o.id, label: o.label, count: this.voteCounts[o.id] ?? 0 })),
        total: Object.values(this.voteCounts).reduce((s, n) => s + n, 0),
      },
      quiz: {
        q: this.quiz.q,
        qNo: this.stopIndex + 1,
        total: d.stops.length,
        revealed: this.quizRevealed,
        answer: this.quiz.show,
        correctCount: this.quizCorrect.length,
        correctNames: this.quizCorrect.map((c) => c.nickname),
      },
      travellers,
      top,
      topGifters,
      events: [...this.events].reverse(),
      spotlight: this.spotlight && this.spotlight.until > now ? this.spotlight : null,
      flagHolder: this.flagHolder,
      flagDest: this.flagDest,
      flowers: this.flowersUntil > now,
      fireworks: this.fireworksUntil > now,
      stars: this.starsUntil > now,
      panorama: this.panoramaUntil > now,
      polaroid: this.polaroidUntil > now,
      players: joined.length,
      banner: this.banner && this.banner.until > now ? this.banner : null,
      musicFlip: this.musicFlip,
    };
  }
}
