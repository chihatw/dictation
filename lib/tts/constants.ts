export const GOOGLE_VOICES = {
  standard: {
    male: {
      'ja-JP-Standard-C': 'ja-JP-Standard-C',
      'ja-JP-Standard-D': 'ja-JP-Standard-D',
    },
    female: {
      'ja-JP-Standard-A': 'ja-JP-Standard-A',
      'ja-JP-Standard-B': 'ja-JP-Standard-B',
    },
  },
  premium: {
    'Chirp3-HD': {
      male: {
        'ja-JP-Chirp3-HD-Charon': 'ja-JP-Chirp3-HD-Charon', // 暗いおじさん
        'ja-JP-Chirp3-HD-Fenrir': 'ja-JP-Chirp3-HD-Fenrir', // ロボットみたいな青年
        'ja-JP-Chirp3-HD-Orus': 'ja-JP-Chirp3-HD-Orus', // 好青年
        'ja-JP-Chirp3-HD-Puck': 'ja-JP-Chirp3-HD-Puck', // 少し硬い、陽キャ青年
      },
      female: {
        'ja-JP-Chirp3-HD-Aoede': 'ja-JP-Chirp3-HD-Aoede', // ハキハキした女性
        'ja-JP-Chirp3-HD-Kore': 'ja-JP-Chirp3-HD-Kore', // 体育教師
        'ja-JP-Chirp3-HD-Leda': 'ja-JP-Chirp3-HD-Leda', // 陰キャ早口
        'ja-JP-Chirp3-HD-Zephyr': 'ja-JP-Chirp3-HD-Zephyr', // ロボット系
      },
    },
    Neural2: {
      male: {
        'ja-JP-Neural2-C': 'ja-JP-Neural2-C',
        'ja-JP-Neural2-D': 'ja-JP-Neural2-D',
      },
      female: {
        'ja-JP-Neural2-B': 'ja-JP-Neural2-B',
      },
    },
    Wavenet: {
      male: {
        'ja-JP-Wavenet-C': 'ja-JP-Wavenet-C',
        'ja-JP-Wavenet-D': 'ja-JP-Wavenet-D',
      },
      female: {
        'ja-JP-Wavenet-A': 'ja-JP-Wavenet-A',
        'ja-JP-Wavenet-B': 'ja-JP-Wavenet-B',
      },
    },
  },
};

export const VOICES = [
  'ja-JP-Chirp3-HD-Charon',
  'ja-JP-Chirp3-HD-Fenrir',
  'ja-JP-Chirp3-HD-Orus',
  'ja-JP-Chirp3-HD-Puck',
  'ja-JP-Chirp3-HD-Aoede',
  'ja-JP-Chirp3-HD-Kore',
  'ja-JP-Chirp3-HD-Leda',
  'ja-JP-Chirp3-HD-Zephyr',
] as const;

export type VoiceOption = (typeof VOICES)[number];

export const DEFAULT_VOICE: VoiceOption = 'ja-JP-Chirp3-HD-Aoede';
export const DEFAULT_RATE = 1.0;

export const clampRateForDB = (n: number) => Math.max(0.1, Math.min(4.0, n));
export const isReasonableRate = (n: number) => n > 0 && n <= 4.0;
