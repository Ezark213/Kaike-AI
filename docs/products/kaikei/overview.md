# Kaikei AI Daily -- プロジェクト概要

**最終更新**: 2026-02-21
**カテゴリ**: 内製プロダクト（自社コンテンツサイト）
**ステータス**: Phase 1 -- 基盤構築中

---

## プロジェクト識別情報

| 項目 | 値 |
|------|-----|
| サイト名 | Kaikei AI Daily |
| ジャンル | AI×会計ニュース（CPA試験合格者監修） |
| 本番URL | https://kaikei-ai.jp |
| Vercel URL | https://kaikei-ai.jp |
| フレームワーク | Astro（SSG）+ Vercel |
| ソースコード | `sites/kaikei-ai-daily/` |
| コンテンツ保管 | `content/kaikei-ai/` |

---

## インフラ・ホスティング

### Vercel（サイトホスティング）

| 項目 | 値 |
|------|-----|
| アカウント | rendel30000-5887 |
| チーム | Ezark (ezark) |
| メール | rendel30000@gmail.com |
| 認証方式 | メール認証（パスワードなし）|
| CLI ログイン | `npx vercel login` → メールリンクをクリック |
| プロジェクト名 | kaikei-ai-daily |

> **認証情報（トークン等）**: `.env.secrets` を参照（`VERCEL_TOKEN`, `VERCEL_EMAIL` 等）

### Xserver（ドメイン管理のみ）

| 項目 | 値 |
|------|-----|
| ドメイン | kaikei-ai.jp |
| 用途 | DNSレコード管理のみ（サーバー機能は不使用） |
| DNS設定 | Aレコード → 76.76.21.21（Vercel IP、設定済み） |

---

## 関連ドキュメント一覧

| 種別 | パス | 内容 |
|------|------|------|
| **戦略・ビジネスモデル** | [`docs/products/kaikei/strategy.md`](../../docs/products/kaikei/strategy.md) | コンテンツ設計・収益モデル・KPI・Phase別ロードマップ |
| **更新計画（ペルソナ・競合・デザイン）** | [`docs/products/kaikei/update-plan.md`](../../docs/products/kaikei/update-plan.md) | ペルソナ分析・競合分析・デザイン更新計画・スプリント計画 |
| **自動化スクリプト群** | [`scripts/kaikei/`](../../scripts/kaikei/) | ニュース収集・記事生成・公開・X投稿 |
| **ニュースソース設定** | [`scripts/kaikei/feeds.yaml`](../../scripts/kaikei/feeds.yaml) | RSSフィード・APIソース一覧 |
| **プロジェクトスキル** | [`.claude/skills/project-kaikei-daily.md`](../../.claude/skills/project-kaikei-daily.md) | ダッシュボードから起動する自律実行スキル |
| **Xアカウント運用** | [`docs/products/kaikei/x-operation.md`](../../docs/products/kaikei/x-operation.md) | @KaikeiAI_Lab 運用方針 |
| **週刊レポート戦略** | [`docs/products/kaikei/weekly-report-strategy.md`](../../docs/products/kaikei/weekly-report-strategy.md) | note有料記事・メンバーシップ戦略 |
| **デザインシステム** | [`docs/design/design-system.md`](../../docs/design/design-system.md) | IBM Carbon準拠（全プロダクト共通・必読） |
| **デザインガイドライン** | [`docs/design/design-guidelines.md`](../../docs/design/design-guidelines.md) | 絵文字禁止・WCAG・レスポンシブ実装 |

---

## 自動化パイプライン

```
[Debian Cron 毎朝5:30 JST]
    ↓
scripts/kaikei/news-collector.py
    (RSS収集 → AI要約 → content/kaikei-ai/daily/YYYY-MM-DD.md 保存)
    ↓
scripts/kaikei/site-publisher.sh
    (git commit → git push → Vercel自動デプロイ)
    ↓
[Vercel Webhook] kaikei-ai.jp に自動公開（5分以内）
    ↓
[Debian Cron 毎朝7:00 JST]
scripts/kaikei/x-content-generator.py
    (X投稿ドラフト → content/kaikei-ai/x-posts/YYYY-MM-DD.md)
```

---

## 現フェーズ・ステータス

### Phase 1: 基盤構築（Month 1-2）進行中

| タスク | 状況 |
|--------|------|
| Astroサイト構築 | 完了 |
| Vercel デプロイ | 完了（kaikei-ai.jp）|
| カスタムドメイン (kaikei-ai.jp) | 完了（DNS設定済み）|
| RSS収集スクリプト | 完了 |
| 記事生成パイプライン | 完了 |
| 手動記事公開（10本） | 完了（2026-02-17〜2026-02-19）|
| 自動パイプライン稼働 | 確認中 |
| Google Search Console | 未登録 |
| AdSense申請準備 | 記事30本到達後 |

### 記事公開状況（2026-02-21時点）

| カテゴリ | 公開数 |
|---------|--------|
| 日次ニュース速報 | 3本（2/17〜2/19） |
| 深掘り解説 | 1本 |
| AI活用Tips | 1本 |
| **合計** | **5本** |

---

## KPI目標

| 指標 | Month 1 | Month 3 | Month 6 | Month 12 |
|------|---------|---------|---------|----------|
| 記事数（累計） | 30 | 100 | 200 | 400 |
| 月間PV | 500 | 3,000 | 10,000 | 30,000 |
| AdSense月収 | ¥0 | ¥1,000 | ¥5,000 | ¥15,000 |
| アフィリエイト月収 | ¥0 | ¥1,000 | ¥3,000 | ¥10,000 |

---

## 次のアクション

1. **P0（即時）**: スマホナビゲーション実装（現在非表示）
2. **P0（今週）**: Google Search Console 登録
3. **P1（今月）**: 記事30本到達 → AdSense申請準備
4. **P1（今月）**: デザイン更新 Sprint 1（`docs/products/kaikei/update-plan.md` 参照）
5. **P2（来月）**: 自動パイプライン安定化・ログ監視

---

## コスト・収益記録

| 項目 | 月額 | 状況 |
|------|------|------|
| Vercel | ¥0 | 無料枠 |
| ドメイン (kaikei-ai.jp) | 〜¥150 | Xserver |
| Anthropic API（記事生成） | ¥3,000-5,000 | 見込み |
| **AdSense収益** | ¥0（現在） | 申請前 |

> 収支詳細: `ledger.md` を参照

---

## @Ezark_ct 更新告知ポリシー（運用方針）

**ページ更新・デプロイのたびに、イザークコンサルティング公式Twitter (@Ezark_ct) で告知ツイートを投稿する。**

| 手順 | 実行者 | タイミング |
|------|--------|-----------|
| 1. デプロイ完了 | Claude Code（Vercel CLI） | 毎朝5:45頃 |
| 2. @Ezark_ct ツイートドラフト自動生成 | site-publisher.sh | デプロイ直後 |
| 3. OpenClaw キューへ自動追加 | site-publisher.sh | ドラフト生成後 |
| 4. @Ezark_ct から告知ツイート投稿 | OpenClaw | 朝6時〜8時台 |

ドラフト保存先: `content/kaikei-ai/x-posts/ezark-ct-YYYY-MM-DD.md`
テンプレート: `tasks/x-promotion-templates.md`

---

## デプロイ方針（重要）

**自動デプロイは無効化済み。全デプロイはVercel CLIで明示的に実行する。**

```
GitHub webhook → vercel.json: ignoreCommand: "exit 1" → ビルドスキップ（意図的）
git push → ソースコード管理のみ（Vercel自動デプロイは発動しない）
```

### デプロイ手順（Vercel CLI）

```bash
# 【標準デプロイ手順】
source scripts/lib/secrets.sh
cd sites/kaikei-ai-daily

# 1. ビルド
npm run build

# 2. Vercel CLIで本番デプロイ（prebuiltモード: ローカルdist/をそのまま送信）
VERCEL_TOKEN=$VERCEL_TOKEN npx vercel deploy --prod --prebuilt \
    --token $VERCEL_TOKEN \
    --yes

# 3. 公開確認
# https://kaikei-ai.jp が更新されていることを確認
```

```bash
# git は別途コミット・プッシュ（ソース管理専用）
git add sites/kaikei-ai-daily/src/
git commit -m "feat: ..."
git push origin main
```

```bash
# Vercel CLI ログイン（トークン切れ時 / 初回）
npx vercel login
# → rendel30000@gmail.com 宛にメールが届く → クリック
```

### 方針の理由

| 方針 | 理由 |
|------|------|
| GitHub自動デプロイ無効化 | デプロイタイミングをClaude Codeが制御するため |
| CLIで明示的デプロイ | 品質確認（ビルド成功・デザイン確認）後に公開するため |
| prebuiltモード | ローカルでビルド検証済みのdist/をそのまま送信。二重ビルドを避ける |
| git pushは継続 | ソースコード管理・バックアップ・コラボレーションのため |
