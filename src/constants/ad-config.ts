/**
 * Google AdSense 広告設定
 *
 * 使い方:
 * 1. Google AdSense管理画面 (https://www.google.com/adsense/) にログイン
 * 2. 「広告」→「広告ユニットごと」→「新しい広告ユニットを作成」
 * 3. 各配置場所に対応する広告ユニットを作成し、スロットIDをここに記入
 *
 * スロットIDが空の場合、その広告枠は表示されません（段階的に有効化可能）
 */

export const AD_CLIENT = 'ca-pub-3306648647011539';

/**
 * 広告スロット設定
 * key: 配置場所の識別名
 * slot: AdSenseで作成した広告ユニットのスロットID（10桁の数字）
 * format: 広告フォーマット
 */
export const AD_SLOTS = {
  /** 記事ページ: タイトル直下・本文直前 (ディスプレイ広告) */
  articleTop: {
    slot: '',
    format: 'auto' as const,
    responsive: true,
  },
  /** 記事ページ: 本文中 h2の2つ目の前 (記事内広告) */
  articleMid: {
    slot: '',
    format: 'fluid' as const,
    layout: 'in-article',
  },
  /** 記事ページ: 本文終了直後 (ディスプレイ広告) */
  articleBottom: {
    slot: '',
    format: 'auto' as const,
    responsive: true,
  },
  /** 記事ページ: ナビゲーション下 (マルチプレックス広告) */
  articleMultiplex: {
    slot: '',
    format: 'autorelaxed' as const,
  },
  /** トップページ/一覧: フィード内広告 */
  feedInline: {
    slot: '',
    format: 'fluid' as const,
    layoutKey: '-fb+5w+4e-db+86',
  },
  /** トップページ: 週刊セクション上 (ディスプレイ広告) */
  homepageDisplay: {
    slot: '',
    format: 'auto' as const,
    responsive: true,
  },
} as const;

/** 自動広告を有効化するか（手動配置と併用可能） */
export const ENABLE_AUTO_ADS = true;
