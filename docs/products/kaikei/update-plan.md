# Kaikei AI Daily -- 更新計画 v1.1

**作成日**: 2026-02-21
**最終更新**: 2026-02-21（v1.1: デザインシステム準拠レビュー・収益化パス修正）
**対象サイト**: kaikei-ai.jp（Vercel: kaikei-ai-daily）
**ステータス**: Phase 1（基盤構築）進行中

---

## 0. サービス概要・アクセス情報

| 項目 | 値 |
|------|-----|
| 本番URL | https://kaikei-ai.jp |
| Vercel URL | https://kaikei-ai.jp |
| Vercelプロジェクト | kaikei-ai-daily（チーム: Ezark） |
| DNS管理 | Xserver（Aレコード → 76.76.21.21） |
| フレームワーク | Astro + Vercel |
| 認証情報保管 | `.env.secrets`（git管理外） |

> **注意**: 認証情報の詳細は `.env.secrets` を参照。Vercelは Email認証方式（npx vercel login → メールリンク認証）。

---

## 1. デザインシステム適合チェック（v1.1追加）

### 1-1. 現状の不適合一覧

> 参照: `docs/design/design-system.md`（Ezark Design System v3.0）

| # | 違反箇所 | 現状値 | 正しい値 | 深刻度 |
|---|---------|--------|---------|--------|
| D-1 | プライマリカラー | `#0f62fe`（IBM Blue） | `#0066cc`（Ezark Ocean） | CRITICAL |
| D-2 | カードborder幅 | `2px solid` | `4px solid var(--color-outline)` | HIGH |
| D-3 | カードdrop shadow | なし | `8px 8px 0 var(--shadow-color)` | HIGH |
| D-4 | ボタンborder幅 | `2px solid` | `3px solid var(--color-outline)` | HIGH |
| D-5 | ボタンdrop shadow | なし | `4px 4px 0 var(--color-outline)` | HIGH |
| D-6 | hoverアニメーション方向 | `translateY(-2px)` | `translate(-2px, -2px)` | MEDIUM |
| D-7 | ダークモード | 未実装 | `prefers-color-scheme` 対応必須 | MEDIUM |
| D-8 | モバイルナビ | `display: none`（完全非表示） | ハンバーガーメニュー必須 | HIGH |
| D-9 | フィーチャーアイコン | テキスト文字（"AI", "CPA"） | Lucide Iconsに置換 | MEDIUM |
| D-10 | フォント（補足） | `Noto Sans JP` | 日本語コンテンツのため許容、fallback追加推奨 | LOW |

**D-10補足**: 日本語コンテンツサイトに `Inter`（ラテン文字専用）は不適切。`Noto Sans JP` を維持し、ラテン文字部分に `Inter` をfallbackとして追加すること。

### 1-2. 修正後のデザイントークン（正式版）

```css
:root {
  /* Ezark Design System v3.0 準拠カラー */
  --color-primary:          #0066cc;           /* Ezark Ocean（旧: #0f62fe は禁止）*/
  --color-primary-hover:    #0052a3;
  --color-on-primary:       #ffffff;
  --color-secondary:        #1a1f36;           /* Ezark Midnight */
  --color-surface:          #ffffff;
  --color-on-surface:       #1a1f36;
  --color-surface-variant:  #f4f6f9;
  --color-on-surface-variant: #6b7280;
  --color-outline:          #1a1f36;           /* Neo-Brutalism border */
  --color-shadow:           rgba(26, 31, 54, 1); /* Neo-Brutalism shadow */
  --color-accent:           #16a34a;           /* Success/監修バッジ */
  --color-bg:               #f4f6f9;

  /* 日本語フォント（例外承認済み: Noto Sans JP + Inter fallback） */
  --font-sans: 'Inter', 'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* 8px グリッドスペーシング */
  --spacing-1: 0.5rem;   /* 8px */
  --spacing-2: 1rem;     /* 16px */
  --spacing-3: 1.5rem;   /* 24px */
  --spacing-4: 2rem;     /* 32px */

  --max-width: 1080px;
}

/* ダークモード（必須実装）*/
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary:         #3385db;
    --color-on-primary:      #ffffff;
    --color-surface:         #0f1117;
    --color-on-surface:      #e4e6eb;
    --color-surface-variant: #1a1f36;
    --color-outline:         #3385db;
    --color-shadow:          rgba(51, 133, 219, 0.5);
    --color-bg:              #0f1117;
  }
}
```

### 1-3. 正しいコンポーネント仕様

**記事カード（Neo-Brutalism準拠）**:
```css
.article-card {
  background: var(--color-surface);
  border: 4px solid var(--color-outline);      /* 2px → 4px */
  box-shadow: 8px 8px 0 var(--color-shadow);   /* drop shadow 必須 */
  padding: var(--spacing-3);                   /* 24px */
  transition: transform 0.2s, box-shadow 0.2s;
}

.article-card:hover {
  transform: translate(-4px, -4px);            /* translateY → 斜め移動 */
  box-shadow: 12px 12px 0 var(--color-shadow); /* shadow拡大 */
}
```

**ボタン（Neo-Brutalism準拠）**:
```css
.btn {
  border: 3px solid var(--color-outline);      /* 2px → 3px */
  box-shadow: 4px 4px 0 var(--color-outline);  /* drop shadow 必須 */
  min-height: 44px;                            /* タッチターゲット */
  min-width: 44px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn:hover {
  transform: translate(-2px, -2px);            /* translateY → 斜め */
  box-shadow: 6px 6px 0 var(--color-outline);
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

---

## 2. ペルソナ分析

### 2-1. プライマリペルソナ

#### P1: 経理マネージャー「田中部長」

```
属性
  年齢: 38歳 / 性別: 男性（一部女性）
  職場: 上場企業 経理部マネージャー
  部下: 5〜15名
  業務: 月次決算・年次監査対応・経理システム管理

情報収集行動
  - 平日朝7〜8時にスマホでニュースチェック
  - 日経・会計専門誌をRSS/Webで購読
  - Xで「#経理DX」「#AI会計」を検索
  - セミナー・webinarに月1〜2回参加

ニーズ（優先順）
  1. AI導入の経営判断材料（ROI・リスク含む）
  2. 会計基準変更の実務影響（法対応）
  3. 部下への業務改善提案のネタ
  4. 競合他社・業界動向

ペインポイント
  - 情報が多すぎて取捨選択に時間がかかる
  - 海外AI記事の日本実務への翻訳が困難
  - 「実際うちの会社に影響あるの？」が分からない
  - 怪しい/間違った情報を部下に共有したくない

KAD への期待
  → CPA試験合格者監修で「信頼できる情報」として部下に共有できる
  → 「実務影響」セクションで時間を節約
  → 法対応ネタを上司報告に活用
```

#### P2: 若手会計士「鈴木さん」

```
属性
  年齢: 28歳 / 性別: 女性（男女半々）
  職場: Big4監査法人 監査スタッフ
  資格: 公認会計士合格・登録済
  関心: AI活用によるキャリア差別化

情報収集行動
  - Xで会計・AI関連アカウントをフォロー
  - note・Substack で有識者の記事購読
  - 法人内の研修・勉強会に積極参加
  - Slack/LINE の会計士コミュニティ

ニーズ（優先順）
  1. AI活用スキルの習得（プロンプト・ワークフロー）
  2. 監査AI・RegTechの最新動向把握
  3. クライアント提案の最新ネタ
  4. 業界全体のAI化進捗の把握

ペインポイント
  - 「AI使いこなしている」というプレッシャー
  - 実際に業務で使えるプロンプトが少ない
  - 理論・概念の記事が多く、実践が少ない
  - 情報の鮮度が命（古い情報は価値ゼロ）

KAD への期待
  → AI活用Tipsで「今日から使える」情報を毎日習得
  → 毎日更新で最新情報を漏らさずキャッチ
  → BOOTHプロンプト集への導線で有料購入
```

#### P3: 税理士事務所スタッフ「山田さん」

```
属性
  年齢: 33歳 / 性別: 男性
  職場: 中規模税理士事務所（スタッフ10名）
  業務: 記帳代行・申告業務・クライアント対応
  関心: 業務効率化・顧客満足度向上

情報収集行動
  - Google検索で具体的な問題解決を探す
  - YouTube でAI活用動画を視聴
  - 所内での口コミ・勉強会
  - freee・MFのヘルプ・ブログ

ニーズ（優先順）
  1. 記帳・申告業務のAI化（即効性重視）
  2. 顧客へのAI活用提案ネタ
  3. 税制改正・新ツールの情報収集
  4. 他の事務所の成功事例

ペインポイント
  - 繁忙期に情報収集の時間がない（特に1〜3月）
  - 「税理士のAI活用」という情報が少ない
  - 高額なAIツールを導入するほどの余裕がない
  - 顧客への情報提供責任（間違い厳禁）

KAD への期待
  → 実務Tips で「安価・すぐ使える」ソリューション
  → 税制×AI ニュースで顧客提案力向上
  → 専門家監修で信頼性の高い情報源として活用
```

### 2-2. セカンダリペルソナ

| ペルソナ | 属性 | KAD利用目的 | マネタイズ |
|---------|------|------------|-----------|
| S1: 経営企画・CFO | 40-55歳 | 投資判断・競合動向 | 有料メンバーシップ（将来）|
| S2: 会計系学生 | 20-25歳 | 業界動向・就活 | BOOTHプロンプト集（低単価） |
| S3: SaaSエンジニア | 25-40歳 | プロダクト開発インプット | AIツールアフィリエイト |

### 2-3. ペルソナ別コンテンツマッピング

| コンテンツ | P1経理Mgr | P2若手会計士 | P3税理士 | S1CFO |
|-----------|-----------|-------------|---------|-------|
| 日次ニュース速報 | ★★★ | ★★★ | ★★ | ★★ |
| 深掘り解説 | ★★★ | ★★ | ★★ | ★★★ |
| AI活用Tips | ★ | ★★★ | ★★★ | ★ |
| CPA視点コラム | ★★ | ★★★ | ★★ | ★★ |
| 法改正・規制ニュース | ★★★ | ★★ | ★★★ | ★★★ |

---

## 3. 競合分析

### 3-1. 競合マップ

```
                    専門性（高）
                         |
              JICPA       |    KAD（目標ポジション）
              企業会計基準 |
                         |
難解・硬い ─────────────────────────── 実用的・やさしい
                         |
              日経/IT系   |    freee/MF ブログ
              AIメディア  |    会計SaaSブログ
                         |
                    専門性（低）
```

### 3-2. 競合詳細

| 競合 | 強み | 弱み | KADの優位性 |
|------|------|------|------------|
| 会計系公式（JICPA/ASBJ）| 権威性・一次情報 | 更新頻度低・AI無縁・難解 | 毎日更新・AI特化・読みやすさ |
| AI系メディア（Ledge.ai）| AI情報の広範囲カバー | 会計専門性ゼロ | CPA試験合格者監修・実務影響フォーカス |
| 会計SaaSブログ（freee/MF）| SEO強・実務Tips | 自社製品中心・中立性欠如 | 中立・複数ツール比較 |
| 個人会計士ブログ | 深い知見・距離近い | 更新不定期・継続性リスク | 毎日更新保証・自動化 |
| 海外AI会計メディア（英語）| 先進性・グローバル | 日本語なし・JP法制未対応 | 日本語特化・JP実務解釈 |

### 3-3. KAD差別化マトリクス

| 差別化要素 | KAD | 会計公式 | AI系 | SaaS系 |
|-----------|-----|---------|------|--------|
| 会計専門性 | ★★★ | ★★★ | ★ | ★★ |
| AI情報の鮮度 | ★★★ | ★ | ★★★ | ★★ |
| 毎日更新 | ★★★ | ★ | ★★ | ★★ |
| 実務影響の解説 | ★★★ | ★★ | ★ | ★★ |
| 読みやすさ | ★★★ | ★ | ★★ | ★★★ |
| 中立性 | ★★★ | ★★★ | ★★ | ★ |

**結論**: KADは「AI情報 × 会計専門性 × 毎日更新 × 実務影響」の四象限で唯一無二のポジション。

---

## 4. デザイン更新計画（デザインシステム準拠版）

### 4-1. ペルソナ別UX改善方針

#### P1（経理マネージャー）向け

```
ニーズ: 「信頼できる情報を素早く確認したい」

改善施策:
  - 「法改正・規制」カテゴリをトップ独立表示
  - CPA試験合格者監修バッジ（Lucide Icons使用）を全記事カードに表示
  - 「実務影響スコア」を各記事に数値化（高/中/低）
  - 読了時間の表示（忙しいマネージャー向け）
  - 週次まとめ記事の定期化
```

#### P2（若手会計士）向け

```
ニーズ: 「今日から使えるAIスキルを毎日積み上げたい」

改善施策:
  - AI活用Tips をホームに目立つ位置で配置
  - タグ検索（プロンプト/ChatGPT/監査AI等）
  - BOOTH商品への誘導バナー（Tips記事末尾）
  - X/はてブ 共有ボタン（Lucide Icons使用）
```

#### P3（税理士スタッフ）向け

```
ニーズ: 「繁忙期でも短時間でキャッチアップしたい」

改善施策:
  - 記事の「要点まとめ」3点をカード上部に表示
  - 「税務」カテゴリを独立セクション化
  - 読了時間の明示（3分で読める、など）
  - モバイル最適化（通勤・移動中の閲覧）
```

### 4-2. カラー体系（デザインシステム準拠）

| カテゴリ | 背景色 | アイコン（Lucide）| 対象ペルソナ |
|---------|--------|-----------------|------------|
| AI会計ニュース | `#dbeafe` | `Rss` | 全員 |
| 法改正・規制 | `#dcfce7` | `FileText` | P1, P3 |
| AI活用Tips | `#ede9fe` | `Zap` | P2, P3 |
| 深掘り解説 | `#fff7ed` | `BookOpen` | P1, S1 |
| CPA視点コラム | `#fee2e2` | `Award` | P2 |

### 4-3. ページ構造改修案

**ホームページ（Before → After）**:
```
Before: Hero → Features（3カード）→ 最新ニュース → CTA

After:
  Hero（改善版）
    - 信頼性バー: [毎朝5:30更新] [CPA試験合格者監修] [全記事無料]
  カテゴリナビ（Lucide Icons使用）
  最新ニュース（強化版カード: 4px border + 8px shadow）
  注目Tips（P2向け）
  深掘り解説ピックアップ（P1向け）
  CTA（BOOTH誘導追加）
```

**記事カード改修（Neo-Brutalism + 機能拡張）**:
```
[日付] [読了時間] [カテゴリアイコン（Lucide）]
タイトル（font-weight: 700）
概要テキスト（最大2行）
[実務影響: HIGH/MEDIUM/LOW]
[CPA試験合格者監修 ✓]
[タグ群] [シェアボタン（Lucide）]
```

---

## 5. 収益化ロードマップ（修正版）

> 前バージョンの問題: Google Search Console・アフィリエイト申請がPhase 2まで後回し。これを修正し、収益化アクションを前倒し。

### 収益化ファネル

```
PV流入（SEO + X）
    ↓
AdSense（CPM広告）: 月間PV 5,000〜 で収益化開始
    ↓
アフィリエイト（freee/MF/弥生/ChatGPT Plus）: 記事30本〜 から申請可能
    ↓
BOOTH商品誘導（Tips記事→プロンプト集購入）: 記事公開直後から
    ↓
有料メンバーシップ（note/独自）: Month 5〜 設計
```

### Sprint 1（2026-02-21〜2026-02-28）: 基盤品質 + 収益化準備

**P0（ブロッカー）**:
- [ ] **Google Search Console 登録**（インデックス登録の最優先、今すぐ）
- [ ] プライマリカラー修正: `#0f62fe` → `#0066cc`（BaseLayout.astro）
- [ ] カードborder・shadow修正（Neo-Brutalism準拠）
- [ ] スマホハンバーガーメニュー実装

**P1（今週中）**:
- [ ] ボタンhover方向修正: `translateY` → `translate(-2px, -2px)`
- [ ] ダークモード基本対応（CSS変数 + `prefers-color-scheme`）
- [ ] フィーチャーアイコンをLucide Iconsに置換
- [ ] カテゴリタグの色分け実装

**P1（今週中・収益化）**:
- [ ] **freee アフィリエイト申請**（A8.net経由）→ 記事内リンク準備
- [ ] **マネーフォワード アフィリエイト申請**（同上）
- [ ] BOOTH商品リンクを既存Tips記事3本に追加

### Sprint 2（2026-03-01〜2026-03-14）: 信頼性・導線強化

**デザイン**:
- [ ] 実務影響スコアコンポーネント追加（記事フロントマター拡張）
- [ ] CPA試験合格者監修バッジを全カードに表示（Lucide: `ShieldCheck`）
- [ ] X/はてブシェアボタン（Lucide使用）
- [ ] 関連記事ウィジェット（同カテゴリ3記事）
- [ ] パンくずリスト追加

**収益化**:
- [ ] アフィリエイトリンク付き記事テンプレート作成（PR表記必須）
- [ ] BOOTH誘導バナー（Tips記事末尾に固定）
- [ ] OGP画像設定（SNSシェア時の画像）

### Sprint 3（2026-03-15〜2026-03-31）: SEO強化・AdSense申請

- [ ] 記事30本到達確認 → AdSense申請（審査に2〜4週間かかるため早期申請）
- [ ] サイトマップXML → Google Search Consoleに送信
- [ ] カテゴリ専用ページ整備（/news, /law, /tips, /deep-dive）
- [ ] RSSフィード強化・告知
- [ ] **ニュースレター登録フォーム**（Resend API使用）

### Sprint 4（2026-04〜）: 収益最大化

- [ ] AdSense承認後 広告配置A/Bテスト
- [ ] 月間PV 3,000達成 → アフィリエイト報酬本格化
- [ ] 有料メンバーシップ設計（note/独自）
- [ ] 弥生・ChatGPT Plus等 追加アフィリエイト申請

---

## 6. 収益チャネル別アクション一覧

### 6-1. アフィリエイト（即着手可能）

| サービス | ネットワーク | 単価目安 | 申請条件 | アクション |
|---------|------------|---------|---------|----------|
| freee 会計 | A8.net | ¥3,000〜/件 | なし | Sprint 1で申請 |
| マネーフォワード クラウド | A8.net | ¥2,000〜/件 | なし | Sprint 1で申請 |
| ChatGPT Plus | 直接（OpenAI） | 要確認 | 要確認 | Sprint 2で調査 |
| 弥生会計 | A8.net | ¥2,000〜/件 | なし | Sprint 3で申請 |

> 全アフィリエイトリンクには「PR」「広告」を明記（景品表示法遵守）。

### 6-2. AdSense

| 条件 | 状況 |
|------|------|
| 記事数 | 30本以上（Sprint 3で到達見込み）|
| コンテンツ品質 | CPA試験合格者監修で独自性確保済み |
| 申請時期 | 記事30本到達直後（2026-03月中旬想定）|
| 承認後の設置場所 | 記事本文上部・下部、サイドバー（将来）|

### 6-3. BOOTH商品誘導

| 記事カテゴリ | 誘導商品 | 設置場所 |
|------------|--------|---------|
| AI活用Tips | 経理AIプロンプト集 | 記事末尾バナー + インライン |
| 深掘り解説 | CPA Prompt Pack | 「AI活用の具体例」セクション |
| 日次ニュース | 関連プロンプト集 | フッター前固定バナー |

---

## 7. KPI追跡

### 月次チェック項目

```
収益KPI
  □ AdSense月収（承認後）
  □ アフィリエイト月収（freee/MF）
  □ BOOTH経由売上
  □ 月間PV（Google Analytics）

サイト品質KPI
  □ 記事公開数（累計）
  □ 平均滞在時間（目標: 3分以上）
  □ モバイル比率（60%以上想定）
  □ 自然検索流入率（3ヶ月後 50%目標）
  □ X (@KaikeiAI_Lab) フォロワー数
```

### デザイン品質チェック（デプロイ前）

```
デザインシステム準拠
  □ Lighthouse Performance > 90
  □ Lighthouse Accessibility > 95
  □ プライマリカラー #0066cc（Ezark Ocean）を使用しているか
  □ カードborder 4px + drop shadow 8px 8px 0 が適用されているか
  □ ボタン hover が translate(-2px, -2px) + shadow拡大か
  □ Lucide Icons を使用しているか（絵文字・テキストアイコン禁止）
  □ ダークモード対応（prefers-color-scheme）
  □ モバイルナビゲーション表示（640px以下）
  □ モバイル表示確認（375px / 414px / 768px）
  □ 絵文字禁止ポリシー遵守
```

---

## 8. 関連ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| `docs/products/kaikei/strategy.md` | 全体戦略・ビジネスモデル |
| `docs/design/design-system.md` | **Ezark Design System v3.0（IBM Carbon準拠・必読）** |
| `docs/design/design-guidelines.md` | 絵文字禁止・WCAG・レスポンシブ詳細 |
| `clients/kaikei-ai-daily/overview.md` | アクセス情報・ステータス管理 |
| `.env.secrets` | Vercel認証情報（git管理外） |
| `sites/kaikei-ai-daily/` | サイトソースコード |
| `scripts/kaikei/` | 自動化パイプライン |
| `.claude/skills/project-kaikei-daily.md` | ダッシュボード起動スキル |

---

**更新履歴**:
- 2026-02-21 v1.1: デザインシステム適合チェック追加、カラー・カード・ボタン仕様修正、収益化アクション前倒し修正
- 2026-02-21 v1.0: 初版作成
