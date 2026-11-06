import { GAME } from './config';

/**
 * Các số Du lịch mà chủ kênh đổi được trên panel (mục "Quản lý — Quà & Du lịch").
 * - Mặc định = đúng số trong config.ts (lấy trực tiếp từ GAME lúc module nạp).
 * - Chủ kênh đổi thì server lưu vào data/game-settings.json; client tải về bằng
 *   GET /api/settings rồi gộp lên GAME (Object.assign) nên điểm/quà tiếp theo
 *   chạy đúng số mới, không cần build lại hay tải lại trang.
 * - giftThanksCooldownSec là giây (panel hiển thị giây); trong GAME lưu theo mili-giây.
 * - musicVolume là % âm lượng nhạc nền (0 là tắt).
 */
export interface GameSettings {
  likesPerStop: number;
  giftGoalXu: number;
  guideSec: number;
  votePts: number;
  quizPts: number;
  giftPts1: number;
  giftPts5: number;
  giftPts10: number;
  giftPts20: number;
  giftPts99: number;
  bigGiftCoins: number;
  giftThanksCooldownSec: number;
  musicVolume: number;
}

export const GAME_SETTING_DEFAULTS: GameSettings = {
  likesPerStop: GAME.likesPerStop,
  giftGoalXu: GAME.giftGoalXu,
  guideSec: GAME.guideSec,
  votePts: GAME.votePts,
  quizPts: GAME.quizPts,
  giftPts1: GAME.giftPts1,
  giftPts5: GAME.giftPts5,
  giftPts10: GAME.giftPts10,
  giftPts20: GAME.giftPts20,
  giftPts99: GAME.giftPts99,
  bigGiftCoins: GAME.bigGiftCoins,
  giftThanksCooldownSec: GAME.giftThanksCooldownMs / 1000,
  musicVolume: GAME.musicVolume,
};

// Giới hạn hợp lý — server (server.ts, sanitizeGameSettings) validate y hệt.
const LIMITS: Record<string, [number, number]> = {
  likesPerStop: [10, 100000],
  giftGoalXu: [10, 100000],
  guideSec: [30, 600],
  votePts: [0, 100],
  quizPts: [1, 500],
  giftPts1: [0, 1000],
  giftPts5: [0, 1000],
  giftPts10: [0, 2000],
  giftPts20: [0, 2000],
  giftPts99: [0, 5000],
  bigGiftCoins: [1, 10000],
  giftThanksCooldownSec: [1, 300],
  musicVolume: [0, 100],
};

const clampInt = (v: unknown, min: number, max: number): number | null => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : null;
};

/** Chỉ giữ các key hợp lệ, số ngoài khoảng thì kẹp vào khoảng (giống server). */
export function sanitizeGameSettings(input: unknown): Partial<GameSettings> {
  if (!input || typeof input !== 'object') return {};
  const o = input as Record<string, unknown>;
  const out: Partial<GameSettings> = {};
  for (const [key, [min, max]] of Object.entries(LIMITS)) {
    if (o[key] === undefined) continue;
    const v = clampInt(o[key], min, max);
    if (v !== null) (out as Record<string, unknown>)[key] = v;
  }
  return out;
}

/** Gộp cài đặt lên GAME (đang chạy cũng áp dụng cho điểm/quà tiếp theo). */
export function applyGameSettings(patch: Partial<GameSettings>) {
  const clean = sanitizeGameSettings(patch);
  const { giftThanksCooldownSec, ...rest } = clean;
  if (giftThanksCooldownSec !== undefined) GAME.giftThanksCooldownMs = giftThanksCooldownSec * 1000;
  Object.assign(GAME, rest);
}

/** Giá trị đang chạy (đọc từ GAME). */
export function currentGameSettings(): GameSettings {
  return {
    likesPerStop: GAME.likesPerStop,
    giftGoalXu: GAME.giftGoalXu,
    guideSec: GAME.guideSec,
    votePts: GAME.votePts,
    quizPts: GAME.quizPts,
    giftPts1: GAME.giftPts1,
    giftPts5: GAME.giftPts5,
    giftPts10: GAME.giftPts10,
    giftPts20: GAME.giftPts20,
    giftPts99: GAME.giftPts99,
    bigGiftCoins: GAME.bigGiftCoins,
    giftThanksCooldownSec: GAME.giftThanksCooldownMs / 1000,
    musicVolume: GAME.musicVolume,
  };
}

/** Tải cài đặt đã lưu trên server về rồi áp dụng lên GAME. */
export async function fetchGameSettings(): Promise<GameSettings> {
  const d = await (await fetch('/api/settings')).json();
  if (d?.data) applyGameSettings(d.data);
  return currentGameSettings();
}
