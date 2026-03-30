# Kaikei AI Daily

AI×会計の最新ニュースを毎朝配信するニュースメディア。CPA試験合格者が全記事を監修。

**本番URL**: https://kaikei-ai.jp

## 技術スタック

| 技術 | 用途 |
|------|------|
| [Astro](https://astro.build/) 4.4 | 静的サイトジェネレーター |
| [Vercel](https://vercel.com/) | ホスティング・デプロイ |
| [Pagefind](https://pagefind.app/) | クライアントサイド全文検索 |
| [Vitest](https://vitest.dev/) | テストフレームワーク |

## コンテンツ

| カテゴリ | 件数 | 概要 |
|---------|------|------|
| Daily | 100+ | 毎日のAI×会計ニュース速報 |
| Deep Dive | 85+ | テーマ別の深掘り解説記事 |
| Weekly | 24+ | 週刊AI会計ダイジェスト |
| Tips | 12+ | 経理実務で使えるAI活用Tips |

## ディレクトリ構成

```
├── src/
│   ├── pages/           # ページテンプレート
│   │   ├── index.astro          # トップページ
│   │   ├── daily/               # デイリーニュース
│   │   ├── weekly/              # 週刊ダイジェスト
│   │   ├── deep-dive/           # 深掘り解説
│   │   ├── tips/                # AI活用Tips
│   │   ├── for/                 # ペルソナ別ページ
│   │   ├── about.astro          # About
│   │   ├── search.astro         # 検索
│   │   └── tags/[tag].astro     # タグアーカイブ
│   ├── layouts/
│   │   └── BaseLayout.astro     # 共通レイアウト
│   ├── components/
│   │   ├── AdUnit.astro         # Google AdSense広告
│   │   ├── NewsletterCTA.astro  # メルマガ登録
│   │   ├── NoteDeepDiveLink.astro # note記事クロスリンク
│   │   └── ShareButtons.astro   # SNSシェアボタン
│   ├── constants/
│   │   ├── site.ts              # サイト共通定数
│   │   └── ad-config.ts         # AdSense広告設定
│   ├── content/                 # 記事コンテンツ（Markdown）
│   │   ├── daily/
│   │   ├── deep-dive/
│   │   ├── weekly/
│   │   └── tips/
│   └── lib/
│       └── date-filter.ts       # 公開日フィルター
├── content/kaikei-ai/           # 記事ソース・X投稿
├── docs/products/kaikei/        # 戦略・運用ドキュメント
├── public/                      # 静的ファイル（OG画像等）
├── astro.config.mjs
├── package.json
└── vercel.json
```

## 開発

```bash
# 依存関係インストール
npm install

# 開発サーバー起動（http://localhost:4321）
npm run dev

# ビルド（dist/に出力 + Pagefindインデックス生成）
npm run build

# ビルド結果プレビュー
npm run preview

# テスト実行
npm test
```

## 主な機能

- **毎朝5:30自動更新** — cronジョブによる記事自動生成・デプロイ
- **CPA試験合格者監修** — 全記事を公認会計士試験合格者が監修
- **ペルソナ別ナビゲーション** — 経理・会計士・税理士・CFO向けのコンテンツ分類
- **Google AdSense** — 記事ページ・一覧ページに広告配置（収益化）
- **A8.netアフィリエイト** — freee・マネーフォワード等の会計ソフト紹介
- **全文検索** — Pagefindによるクライアントサイド検索
- **SEO最適化** — JSON-LD構造化データ・サイトマップ・RSS
- **ダークモード** — システム設定連動 + 手動切替
- **WCAG 2.2 AA準拠** — スキップリンク・フォーカス表示・セマンティックHTML

## 収益化

| チャネル | 状態 |
|---------|------|
| Google AdSense | 審査通過済・広告枠実装済（スロットID設定待ち） |
| A8.net アフィリエイト | freee・MF・FXTF連携済 |
| BOOTH | 経理AIプロンプト集販売 |
| note | 週刊AI会計レポート配信 |

## TODO

- [x] **AdSense広告ユニット作成・スロットID設定** — `src/constants/ad-config.ts` に全6スロットID設定済み。再ビルド＆デプロイで有効化。
  - [x] `articleTop` — ディスプレイ広告（`3780121659`）
  - [x] `articleMid` — 記事内広告（`6214713307`）
  - [x] `articleBottom` — ディスプレイ広告（`5740070584`）
  - [x] `articleMultiplex` — マルチプレックス広告（`2142667000`）
  - [x] `feedInline` — フィード内広告（`6023141614`）
  - [x] `homepageDisplay` — ディスプレイ広告（`5528114334`）

## ライセンス

Private repository. All rights reserved.
