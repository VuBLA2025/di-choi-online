import { useEffect, useState } from 'react';
import { panelHeaders } from './page';
import { GAME_SETTING_DEFAULTS, type GameSettings } from '../game/gameSettings';

type Form = { [K in keyof GameSettings]: string };
type NumKey = keyof GameSettings;

const TRIP_FIELDS: Array<{ key: NumKey; label: string; hint: string; min: number; max: number }> = [
  { key: 'likesPerStop', label: 'Tim mở điểm tiếp theo', hint: 'tim — đủ từng này tim thì xe chạy tới điểm dừng tiếp theo', min: 10, max: 100000 },
  { key: 'giftGoalXu', label: 'Mục tiêu quà cả đoàn', hint: 'xu — đủ từng này xu quà thì điểm sau thành Điểm Vàng (điểm x2)', min: 10, max: 100000 },
  { key: 'guideSec', label: 'Hướng dẫn viên kéo dài', hint: 'giây — quà 20 xu làm Hướng dẫn viên chừng này giây', min: 30, max: 600 },
  { key: 'votePts', label: 'Điểm 1 lượt vote', hint: 'điểm — vote 1/2/3 ở mỗi điểm dừng', min: 0, max: 100 },
  { key: 'quizPts', label: 'Điểm trả lời đúng', hint: 'điểm — trả lời đúng đố vui ở điểm dừng', min: 1, max: 500 },
  { key: 'musicVolume', label: 'Nhạc nền', hint: '% âm lượng — 0 là tắt nhạc', min: 0, max: 100 },
];

const GIFT_FIELDS: Array<{ key: NumKey; label: string; hint: string; min: number; max: number }> = [
  { key: 'giftPts1', label: 'Quà 1 xu', hint: 'điểm + chụp ảnh polaroid kỷ niệm', min: 0, max: 1000 },
  { key: 'giftPts5', label: 'Quà 5 xu', hint: 'điểm + gọi món địa phương', min: 0, max: 1000 },
  { key: 'giftPts10', label: 'Quà 10 xu', hint: 'điểm + hoàng hôn + pháo hoa', min: 0, max: 2000 },
  { key: 'giftPts20', label: 'Quà 20 xu', hint: 'điểm + làm Hướng dẫn viên', min: 0, max: 2000 },
  { key: 'giftPts99', label: 'Quà 99 xu', hint: 'điểm + cắm cờ lưu niệm mang tên', min: 0, max: 5000 },
  { key: 'bigGiftCoins', label: 'Quà lớn', hint: 'xu — từ từng này xu MC khen to', min: 1, max: 10000 },
  { key: 'giftThanksCooldownSec', label: 'Cảm ơn quà', hint: 'giây — cùng 1 người chỉ cảm ơn 1 lần mỗi từng này giây', min: 1, max: 300 },
];

const toForm = (s: GameSettings): Form => {
  const f = {} as Form;
  (Object.keys(s) as Array<keyof GameSettings>).forEach((k) => {
    f[k] = String(s[k]);
  });
  return f;
};

/** Card "Quản lý — Quà & Du lịch": đổi số chuyến đi/quà, lưu lên máy chủ (deploy lại không mất). */
export function ManageGifts() {
  const [form, setForm] = useState<Form>(() => toForm(GAME_SETTING_DEFAULTS));
  const [loaded, setLoaded] = useState(false);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [armReset, setArmReset] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d?.data) setForm(toForm(d.data));
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const set = (key: keyof GameSettings, v: string) => {
    setForm((f) => ({ ...f, [key]: v }));
    setMsg('');
  };

  const parseForm = (): { patch: Partial<GameSettings>; error?: string } => {
    const patch: Partial<GameSettings> = {};
    for (const f of [...TRIP_FIELDS, ...GIFT_FIELDS]) {
      const raw = form[f.key].trim();
      if (raw === '') return { patch, error: `Chưa nhập "${f.label}"` };
      const n = Number(raw);
      if (!Number.isFinite(n)) return { patch, error: `"${f.label}": phải là số` };
      if (n < f.min || n > f.max) return { patch, error: `"${f.label}": nhập từ ${f.min} tới ${f.max}` };
      (patch as Record<string, unknown>)[f.key] = Math.round(n);
    }
    return { patch };
  };

  const postSettings = async (patch: Partial<GameSettings>, okMsg: string) => {
    setBusy(true);
    setMsg('');
    try {
      const r = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...panelHeaders() },
        body: JSON.stringify(patch),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.success) {
        setMsg(
          d.error === 'Sai mật khẩu panel'
            ? 'Sai mật khẩu panel — nhập mật khẩu ở ô "Mật khẩu panel" phía trên rồi bấm Lưu lại.'
            : d.error || `Lưu thất bại (HTTP ${r.status})`,
        );
      } else {
        if (d.data) setForm(toForm(d.data));
        setMsg(okMsg);
      }
    } catch (e) {
      setMsg(`Không gọi được máy chủ: ${String(e)}`);
    }
    setBusy(false);
  };

  const save = () => {
    const { patch, error } = parseForm();
    if (error) return setMsg(error);
    void postSettings(patch, 'Đã lưu cài đặt Quà & Du lịch — áp dụng ngay cho điểm/quà tiếp theo.');
  };

  const reset = () => {
    if (!armReset) {
      setArmReset(true);
      setMsg('Bấm "Về mặc định" lần nữa để xác nhận đưa mọi số về mặc định.');
      setTimeout(() => setArmReset(false), 5000);
      return;
    }
    setArmReset(false);
    void postSettings(GAME_SETTING_DEFAULTS, 'Đã đưa mọi số về mặc định.');
  };

  return (
    <section className="rounded-2xl bg-slate-900 p-3 ring-1 ring-slate-800">
      <h2 className="mb-2 font-semibold">🎁 Quản lý — Quà &amp; Du lịch</h2>
      {!loaded && <p className="text-xs text-slate-500">Đang tải cài đặt...</p>}
      <div className="mb-2 text-xs font-medium text-amber-300">Chuyến đi</div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        {TRIP_FIELDS.map((f) => (
          <label key={f.key} className="block">
            <span className="text-xs text-slate-400">{f.label}</span>
            <input type="number" min={f.min} max={f.max} step={1} className="mt-0.5 w-full rounded-lg bg-slate-800 px-2 py-1.5" value={form[f.key]} onChange={(e) => set(f.key, e.target.value)} />
            <span className="text-[11px] leading-tight text-slate-500">{f.hint}</span>
          </label>
        ))}
      </div>
      <div className="mb-2 mt-3 text-xs font-medium text-amber-300">Quà theo xu</div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        {GIFT_FIELDS.map((f) => (
          <label key={f.key} className="block">
            <span className="text-xs text-slate-400">{f.label}</span>
            <input type="number" min={f.min} max={f.max} step={1} className="mt-0.5 w-full rounded-lg bg-slate-800 px-2 py-1.5" value={form[f.key]} onChange={(e) => set(f.key, e.target.value)} />
            <span className="text-[11px] leading-tight text-slate-500">{f.hint}</span>
          </label>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={save} disabled={busy} className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-slate-950 hover:bg-amber-400 disabled:opacity-40">
          {busy ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
        <button onClick={reset} disabled={busy} className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium hover:bg-slate-700 disabled:opacity-40">
          Về mặc định
        </button>
      </div>
      {msg && <div className="mt-2 text-xs text-amber-300">{msg}</div>}
      <p className="mt-1 text-xs text-slate-500">
        Đổi xong áp dụng ngay cho điểm/quà tiếp theo, không cần tải lại stage. Cài đặt lưu trên máy chủ nên deploy lại vẫn còn. Cần nhập mật khẩu panel mới lưu được.
      </p>
    </section>
  );
}
