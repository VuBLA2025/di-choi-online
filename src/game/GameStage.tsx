import { useEffect, useState } from 'react';
import { Bus, Clock, Crown, Gift, Heart, MapPin, Megaphone, Star, Trophy, Users, Zap } from 'lucide-react';
import type { GameState, StageView } from './useGame';
import { GAME } from './config';

/**
 * Sân du lịch 1080x1920, vẽ bằng CSS (không cần ảnh ngoài).
 * Trên: tên đoàn + vòng du lịch + đồng hồ.
 * Giữa: điểm đến hiện tại + xe du lịch chở hành khách.
 * Dưới: điểm dừng hiện tại (chuyện MC / vote / đố vui) + Top du khách + dòng sự kiện.
 */
export function GameStage({ game }: { game: GameState }) {
  const v = game.view;
  const [clock, setClock] = useState('');
  useEffect(() => {
    const f = () => setClock(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    f();
    const t = setInterval(f, 1000);
    return () => clearInterval(t);
  }, []);

  if (!v) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-teal-950 text-white">
        <Bus size={64} className="mb-4 text-amber-400" />
        <div className="text-3xl font-bold">Đi Chơi Online</div>
        <div className="mt-2 text-xl text-teal-300">Đang chuẩn bị xe du lịch...</div>
      </div>
    );
  }

  const likePct = Math.max(0, Math.min(100, (v.likes / Math.max(1, v.likesTarget)) * 100));
  const giftPct = Math.max(0, Math.min(100, (v.giftGoal.xu / Math.max(1, v.giftGoal.target)) * 100));
  const phaseTotal = v.phase === 'arrive' ? GAME.phaseSec.arrive : v.phase === 'visit' ? GAME.phaseSec.visit : GAME.phaseSec.celebrate;
  const phasePct = Math.max(0, Math.min(100, (v.phaseLeftSec / phaseTotal) * 100));

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-b from-teal-950 via-cyan-900 to-teal-950 text-white" style={{ fontFamily: "'Be Vietnam Pro', system-ui, sans-serif" }}>
      <style>{`@keyframes pop{0%{transform:scale(.6);opacity:0}100%{transform:scale(1);opacity:1}} @keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}} @keyframes shine{0%{background-position:-200% 0}100%{background-position:200% 0}} @keyframes fall{0%{transform:translateY(-10px);opacity:0}20%{opacity:1}100%{transform:translateY(120px);opacity:0}} .anim-pop{animation:pop .35s ease-out} .anim-float{animation:floaty 2.5s ease-in-out infinite} .gold-shine{background:linear-gradient(90deg,#f59e0b,#fde68a,#f59e0b);background-size:200% 100%;animation:shine 1.6s linear infinite} .fall{animation:fall 2.2s ease-in infinite}`}</style>

      {/* ===== Header ===== */}
      <header className="flex items-center justify-between px-6 pt-5">
        <div>
          <div className="flex items-center gap-2 text-3xl font-extrabold tracking-tight">
            <Bus className="text-amber-400" size={34} />
            {game.channelName}
          </div>
          <div className="mt-1 flex items-center gap-3 text-lg text-teal-200">
            <span className="rounded-full bg-teal-800 px-3 py-0.5">Vòng {v.journey}</span>
            <span className="flex items-center gap-1">
              <Users size={20} /> {v.players} du khách
            </span>
            <span className="flex items-center gap-1">
              <Heart size={20} className="text-rose-400" /> {game.status?.totalLikes ?? 0} tim
            </span>
          </div>
        </div>
        <div className="rounded-2xl bg-teal-800/80 px-4 py-2 text-center">
          <div className="flex items-center gap-1 text-sm text-teal-200">
            <Clock size={16} /> Giờ đi chơi
          </div>
          <div className="text-3xl font-bold tabular-nums">{clock}</div>
        </div>
      </header>

      {/* ===== Điểm đến hiện tại ===== */}
      <section className="mx-6 mt-4 rounded-3xl bg-teal-900/80 p-4 ring-1 ring-teal-700">
        <div className="flex items-center justify-between text-xl font-bold">
          <span>
            {v.destEmoji} {v.destName}
          </span>
          <span className="text-base font-normal text-teal-200">{v.destTagline}</span>
          <span className="text-amber-300">
            Điểm {v.stopIndex + 1}/{v.stopsTotal}
          </span>
        </div>
        <div className="mt-2 flex gap-1.5">
          {Array.from({ length: v.stopsTotal }, (_, i) => (
            <div
              key={i}
              className={`h-3 flex-1 rounded-full ${i < v.stopIndex ? 'bg-emerald-400' : i === v.stopIndex ? 'bg-amber-400' : 'bg-teal-700'}`}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between text-base text-teal-100">
          <span className="flex items-center gap-1">
            <Heart size={18} className="text-rose-400" /> Tim mở điểm tiếp theo: {v.likes}/{v.likesTarget}
          </span>
          {v.golden ? (
            <span className="gold-shine anim-pop flex items-center gap-1 rounded-full px-3 py-1 font-bold text-slate-950">
              <Zap size={18} /> ĐIỂM VÀNG x2
            </span>
          ) : v.nextGolden ? (
            <span className="anim-pop rounded-full bg-amber-500/20 px-3 py-1 font-bold text-amber-300">Điểm sau là Điểm Vàng!</span>
          ) : (
            <span>Đủ tim là xe chạy tiếp</span>
          )}
        </div>
        <div className="mt-2 h-4 overflow-hidden rounded-full bg-teal-800">
          <div className="h-full bg-rose-400 transition-all duration-500" style={{ width: `${likePct}%` }} />
        </div>
        <div className="mt-3 flex items-center justify-between text-base text-teal-100">
          <span className="flex items-center gap-1">
            <Gift size={18} className="text-amber-300" /> Mục tiêu quà cả đoàn: {v.giftGoal.xu}/{v.giftGoal.target} xu
          </span>
          <span>{v.topGifters.length > 0 ? `Top quà: ${v.topGifters[0].nickname} (${v.topGifters[0].diamonds} xu)` : 'Chưa có ai tặng quà...'}</span>
        </div>
        <div className="mt-2 h-4 overflow-hidden rounded-full bg-teal-800">
          <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${giftPct}%` }} />
        </div>
      </section>

      {/* ===== Xe du lịch ===== */}
      <section className="relative mx-6 mt-4 flex-1 rounded-3xl bg-[#134e4a] p-4 ring-1 ring-teal-700">
        <div className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 59px, #5eead4 60px)' }} />
        {v.flowers && <div className="pointer-events-none absolute inset-x-0 top-2 z-20 text-center text-4xl">🌹🌸🌹🌸🌹</div>}
        {v.fireworks && <div className="pointer-events-none absolute inset-x-0 top-2 z-20 text-center text-4xl anim-float">🎆🌅🎇🎆🌅</div>}
        {v.stars && <div className="pointer-events-none absolute inset-x-0 top-2 z-20 text-center text-4xl">✨🌟💫✨🌟</div>}
        {v.panorama && <div className="pointer-events-none absolute inset-x-0 top-2 z-20 text-center text-4xl anim-float">🏞️📷🏞️📷🏞️</div>}
        {v.polaroid && <div className="pointer-events-none absolute inset-x-0 top-2 z-20 text-center text-4xl">📸🖼️📸</div>}
        <div className="mb-2 flex items-center gap-2 text-lg font-bold text-amber-300">
          <Bus size={22} /> Xe du lịch — {v.travellers.length} hành khách trên xe
        </div>
        <div className="flex min-h-[150px] flex-wrap items-center gap-3 rounded-2xl bg-teal-950/60 px-3 py-3">
          {v.travellers.length === 0 && <span className="text-lg text-teal-300">Xe còn trống... gõ "đi chơi" để lên xe!</span>}
          {v.travellers.map((s) => (
            <div key={s.username} className="relative flex w-[86px] flex-col items-center">
              {s.bubble && (
                <div className="anim-pop absolute -top-9 z-10 max-w-[150px] truncate rounded-xl bg-white px-2 py-1 text-sm font-medium text-slate-900 shadow">{s.bubble}</div>
              )}
              <div
                className={`flex h-16 w-16 items-center justify-center overflow-hidden rounded-full text-2xl font-bold ring-2 ${s.isGuide ? 'ring-amber-300' : 'ring-teal-400'}`}
                style={{ background: '#0d9488', color: '#fff' }}
              >
                {s.avatar ? <img src={s.avatar} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" /> : (s.nickname || '?').trim().charAt(0).toUpperCase()}
              </div>
              <div className="mt-1 w-full truncate text-center text-sm">{s.nickname}</div>
              <div className="text-xs text-amber-300 tabular-nums">{s.points} điểm</div>
              {s.isGuide && <div className="text-xs font-bold text-amber-300">HƯỚNG DẪN VIÊN</div>}
            </div>
          ))}
        </div>
        {v.flagHolder && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-500/20 px-3 py-2 text-lg">
            <span>🚩</span>
            <span>
              Cờ lưu niệm ở {v.flagDest}: <b className="text-amber-300">{v.flagHolder}</b>
            </span>
          </div>
        )}
        {v.spotlight && (
          <div className="anim-pop absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-amber-400 px-6 py-4 text-center text-slate-950 shadow-2xl">
            <div className="flex items-center justify-center gap-2 text-2xl font-extrabold">
              <Star size={26} />
              {v.spotlight.kind === 'guide' ? 'HƯỚNG DẪN VIÊN' : v.spotlight.kind === 'flag' ? 'CỜ LƯU NIỆM' : 'NGÔI SAO CHUYẾN ĐI'}
            </div>
            <div className="mt-1 text-3xl font-bold">{v.spotlight.nickname}</div>
          </div>
        )}
      </section>

      {/* ===== Điểm dừng hiện tại ===== */}
      <section className="mx-6 mt-4 rounded-3xl bg-teal-900/80 p-4 ring-1 ring-teal-700">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-2xl font-bold">
            <MapPin className="text-amber-400" size={26} />
            {v.phaseLabel} · {v.stopEmoji} {v.stopName}
          </span>
          <span className="rounded-full bg-teal-800 px-3 py-1 text-xl font-bold tabular-nums">còn {v.phaseLeftSec}s</span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-teal-800">
          <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${phasePct}%` }} />
        </div>
        <div className="mt-3 min-h-[64px] text-xl leading-snug text-teal-50">
          {v.phase === 'arrive' && <p>{v.stopStory}</p>}
          {v.phase === 'visit' && (
            <div>
              <p className="mb-2">Vote chọn việc làm ở đây — gõ 1 / 2 / 3:</p>
              <div className="flex gap-2">
                {v.vote.options.map((o) => (
                  <span key={o.id} className="flex-1 rounded-xl bg-teal-800 px-2 py-2 text-center text-lg">
                    <b>{o.id}.</b> {o.label} <span className="text-amber-300">({o.count})</span>
                  </span>
                ))}
              </div>
              <p className="mt-3 font-semibold">
                Đố vui: {v.quiz.q}
              </p>
              <p className="mt-1 text-lg text-teal-200">
                {v.quiz.revealed ? (
                  <>
                    Đáp án: <b className="text-emerald-300">{v.quiz.answer}</b> · {v.quiz.correctCount} bạn đúng: {v.quiz.correctNames.slice(0, 3).join(', ')}
                    {v.quiz.correctNames.length > 3 ? '...' : ''}
                  </>
                ) : (
                  <>Gõ đáp án vào bình luận — đúng được +{v.golden ? GAME.quizPts * 2 : GAME.quizPts} điểm · đã có {v.quiz.correctCount} bạn đúng</>
                )}
              </p>
            </div>
          )}
          {v.phase === 'celebrate' && (
            <p>
              🎉 Cả đoàn đã đi hết 10 điểm ở {v.destName}! Nghỉ một chút rồi mình sang điểm đến tiếp theo nhé!
            </p>
          )}
        </div>
      </section>

      {/* ===== Bảng quà + Top du khách ===== */}
      <section className="mx-6 mb-5 mt-4 grid flex-none grid-cols-2 gap-3">
        <div className="rounded-2xl bg-teal-900/80 p-3 ring-1 ring-teal-700">
          <div className="mb-1 flex items-center gap-1 text-lg font-bold text-amber-300">
            <Gift size={20} /> Tặng quà được gì
          </div>
          <div className="space-y-0.5 text-base leading-snug">
            <div>1 xu 📸 polaroid kỷ niệm</div>
            <div>5 xu 🍜 món địa phương</div>
            <div>10 xu 🌅 hoàng hôn + pháo hoa</div>
            <div>20 xu 🧭 hướng dẫn viên 3 phút</div>
            <div>99 xu 🚩 cờ lưu niệm mang tên</div>
            <div>🌹 hoa nở · 🎫 mở view · 🌌 ngắm sao</div>
          </div>
        </div>
        <div className="rounded-2xl bg-teal-900/80 p-3 ring-1 ring-teal-700">
          <div className="mb-1 flex items-center gap-1 text-lg font-bold text-amber-300">
            <Trophy size={20} /> Top du khách
          </div>
          {v.top.length === 0 && <div className="text-teal-300">Chưa có ai...</div>}
          {v.top.map((p, i) => (
            <div key={i} className="flex justify-between text-lg">
              <span>
                {i + 1}. {p.nickname}
                {i === 0 && <Crown className="mb-1 ml-1 inline text-amber-300" size={18} />}
              </span>
              <b className="tabular-nums">{p.points}</b>
            </div>
          ))}
          {v.topGifters.length > 0 && (
            <div className="mt-2 border-t border-teal-700 pt-1 text-base text-teal-200">
              Top quà: {v.topGifters.map((g) => `${g.nickname} (${g.diamonds} xu)`).join(' · ')}
            </div>
          )}
        </div>
      </section>

      <footer className="mx-6 mb-4 flex-none space-y-1">
        {v.events.slice(0, 3).map((e, i) => (
          <div key={`${e.at}-${i}`} className="truncate text-base text-teal-200">
            {e.kind === 'gift' ? '🎁' : e.kind === 'golden' ? '⚡' : e.kind === 'dest' ? '🎉' : e.kind === 'quiz' ? '✅' : '👋'} {e.text}
          </div>
        ))}
        {game.lastGift && (
          <div className="flex items-center gap-1 truncate text-base text-amber-300">
            <Gift size={18} /> Quà mới: {game.lastGift.nickname} tặng {game.lastGift.giftName} ({game.lastGift.diamondCount * game.lastGift.repeatCount} xu)
          </div>
        )}
      </footer>

      {v.banner && (
        <div className="anim-pop absolute inset-x-10 top-[38%] z-40 rounded-3xl bg-amber-400 px-6 py-5 text-center text-3xl font-extrabold text-slate-950 shadow-2xl">{v.banner.text}</div>
      )}
    </div>
  );
}
