import { useState } from 'react';
import { emitTest, sendControl } from '../live/page';
import type { StageView } from './useGame';
import { GAME } from './config';

// Nút riêng của Đi Chơi Online ở trang điều khiển: điều khiển chuyến + giả lập bot (tối đa 16 bot)
const HO = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi'];
const TEN = ['Lan Anh', 'Minh Tuấn', 'Thu Trang', 'Quốc Bảo', 'Ngọc Hân', 'Gia Huy', 'Khánh Linh', 'Hải Yến', 'Đức Anh', 'Bảo Ngọc', 'Thanh Hà', 'Văn Toàn'];
const fake = (i: number) => ({ username: `khach${i}`, nickname: `${HO[i % HO.length]} ${TEN[i % TEN.length]}`, avatar: '' });

export function GameControls({ view, stageCount = 0 }: { view: StageView | null; stageCount?: number }) {
  const [sent, setSent] = useState(0);
  const [running, setRunning] = useState(false);
  const [botOn, setBotOn] = useState(false);

  /** Giả lập tối đa 16 bot lên xe: lên xe, vote, trả lời đố vui, thả tim */
  const flood = async (n: number) => {
    if (running) return;
    setRunning(true);
    setSent(0);
    let done = 0;
    const jobs = Array.from({ length: Math.min(16, n) }, (_, i) => {
      const who = fake(i);
      const acts: Array<() => Promise<void>> = [
        async () => emitTest('chat', { ...who, comment: 'đi chơi' }),
        async () => emitTest('chat', { ...who, comment: String(1 + (i % 3)) }),
        async () => emitTest('chat', { ...who, comment: view?.quiz.answer.toLowerCase() ?? 'da nang' }),
        async () => emitTest('like', { ...who, likeCount: 20 }),
      ];
      return Promise.all(
        acts.map((fn, j) => new Promise<void>((ok) => setTimeout(async () => {
          await fn().catch(() => {});
          setSent(++done);
          ok();
        }, 500 + j * 1500 + Math.random() * 1000))),
      );
    });
    await Promise.all(jobs);
    setRunning(false);
  };

  return (
    <div className="space-y-3">
      {stageCount > 1 && <div className="rounded-lg bg-red-600 p-2 text-white">Đang mở {stageCount} trang stage, sẽ có 2 giọng. Đóng bớt đi.</div>}
      {view && (
        <div className="rounded-lg bg-slate-800 p-3 text-sm leading-6">
          <div>
            Vòng {view.journey} · {view.destEmoji} {view.destName} · Điểm {view.stopIndex + 1}/{view.stopsTotal}: {view.stopName} · {view.phaseLabel} · còn {view.phaseLeftSec}s
          </div>
          <div>
            Đang đi chơi: <b>{view.players}</b> du khách · Tim mở điểm tiếp: {view.likes}/{view.likesTarget}
            {view.golden && <span className="text-amber-300"> · ⚡ Điểm Vàng x2</span>}
            {view.nextGolden && <span className="text-amber-300"> · Điểm sau là Điểm Vàng</span>}
          </div>
          <div>
            Mục tiêu quà cả đoàn: {view.giftGoal.xu}/{view.giftGoal.target} xu
            {view.flagHolder && <span> · 🚩 Cờ: {view.flagHolder} ở {view.flagDest}</span>}
          </div>
          {(view.phase === 'arrive' || view.phase === 'visit') && (
            <div>
              Đố vui (chỉ mình thấy): <b className="text-amber-300">{view.quiz.q}</b> → đáp án: <b className="text-emerald-300">{view.quiz.answer}</b>
            </div>
          )}
          {sent > 0 && <div>Giả lập đã gửi: {sent}</div>}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Btn onClick={() => sendControl('custom', 'skip')}>⏭ Qua điểm tiếp theo</Btn>
        <Btn onClick={() => sendControl('custom', 'newJourney')}>🔄 Chuyến mới</Btn>
        <Btn onClick={() => sendControl('custom', 'golden')}>⚡ Mở Điểm Vàng ngay</Btn>
        <Btn onClick={() => emitTest('chat', { ...fake(1), comment: 'đi chơi' })}>🚌 1 bạn lên xe</Btn>
        <Btn onClick={() => emitTest('chat', { ...fake(2), comment: '1' })}>📸 1 bạn vote 1</Btn>
        <Btn onClick={() => emitTest('chat', { ...fake(3), comment: view?.quiz.answer.toLowerCase() ?? 'da nang' })}>✅ 1 bạn trả lời đúng</Btn>
        <Btn onClick={() => emitTest('gift', { ...fake(4), giftName: 'Hoa hồng', giftId: 5655, diamondCount: 1, repeatCount: 1 })}>🌹 Tặng hoa (1 xu)</Btn>
        <Btn onClick={() => emitTest('gift', { ...fake(5), giftName: 'Travel Ticket', giftId: 1, diamondCount: 10, repeatCount: 1 })}>🎫 Vé du lịch (10 xu)</Btn>
        <Btn onClick={() => emitTest('gift', { ...fake(6), giftName: 'Galaxy', giftId: 1, diamondCount: 99, repeatCount: 1 })}>🌌 Galaxy (99 xu)</Btn>
        <Btn onClick={() => emitTest('like', { ...fake(7), likeCount: 100 })}>❤️ 100 tim (mở điểm tiếp)</Btn>
        <Btn
          onClick={() => {
            setBotOn(!botOn);
            if (!botOn) void flood(16);
          }}
          disabled={running}
        >
          {botOn ? '⏹ Tắt bot test' : '🤖 Bật 16 bot test'}
        </Btn>
      </div>
      <p className="text-xs text-slate-500">
        Bot chỉ tạo sự kiện thử trên màn hình, không phải người xem thật. Tắt bot trước khi live thật để số liệu trên sân chỉ còn người xem thật.
      </p>
    </div>
  );
}

function Btn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className="rounded-lg bg-slate-700 px-3 py-2 text-sm text-white hover:bg-slate-600 disabled:opacity-40">
      {children}
    </button>
  );
}
