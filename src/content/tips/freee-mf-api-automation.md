---
title: 'freee/MF API連携で月次決算を自動化するエンジニア向けガイド'
date: '2026-03-05'
summary: 'freee APIとマネーフォワード APIを活用して月次決算を自動化する方法をエンジニア向けに解説。OAuth認証からデータ取得、自動チェックまで。'
tags: ['freee', 'マネーフォワード', 'API', '自動化', '月次決算', 'Python']
tool: 'freee API / MF API'
---

## はじめに

エンジニアが個人事業主として活動する場合、経理作業は「必要だけど本業ではない」タスクです。しかし、エンジニアには強力な武器があります――APIとプログラミングスキルです。

freeeとマネーフォワード（MF）はいずれも充実したREST APIを公開しており、経理作業の大部分をプログラムで自動化できます。本記事では、APIを活用した月次決算の自動化を、OAuth認証のセットアップからPythonスクリプトの実装まで実践的に解説します。

## freee API vs MF API 比較

### API概要

| 項目 | freee API | MF API |
|------|-----------|--------|
| 認証方式 | OAuth 2.0 | OAuth 2.0 |
| ベースURL | `https://api.freee.co.jp` | `https://api.moneyforward.com` |
| APIドキュメント | 充実（OpenAPI仕様公開） | 充実 |
| SDK | Python/Ruby/JS 公式 | Python/Ruby 公式 |
| レート制限 | 300回/5分 | 500回/5分 |
| 無料プラン対応 | 一部制限あり | 一部制限あり |
| Webhook | 対応 | 一部対応 |

### 利用可能な主なエンドポイント

**freee API:**
- `/api/1/deals` -- 取引（収入・支出）の登録・取得
- `/api/1/journals` -- 仕訳帳の取得
- `/api/1/trial_balance` -- 試算表の取得
- `/api/1/invoices` -- 請求書の管理
- `/api/1/receipts` -- レシートのアップロード・OCR
- `/api/1/partners` -- 取引先マスタ
- `/api/1/account_items` -- 勘定科目マスタ

**MF API:**
- `/api/v3/office/transactions` -- 取引の登録・取得
- `/api/v3/office/journals` -- 仕訳の取得
- `/api/v3/office/trial_bs` -- 貸借対照表
- `/api/v3/office/trial_pl` -- 損益計算書
- `/api/v3/office/billings` -- 請求書

## Step 1: OAuth 2.0認証のセットアップ

### freee APIの場合

1. [freee開発者ページ](https://developer.freee.co.jp/)でアプリを登録
2. Client IDとClient Secretを取得
3. 認可コードフローでアクセストークンを取得

```python
# トークン更新（最重要パーツ）
def refresh_freee_token(refresh_token: str) -> dict:
    response = requests.post(FREEE_TOKEN_URL, data={
        "grant_type": "refresh_token",
        "client_id": FREEE_CLIENT_ID,
        "client_secret": FREEE_CLIENT_SECRET,
        "refresh_token": refresh_token
    })
    tokens = response.json()
    with open(".freee_tokens.json", "w") as f:
        json.dump(tokens, f, indent=2)
    return tokens
```

トークン管理では、`created_at + expires_in`で有効期限を計算し、期限5分前に自動更新するクラスを実装するのがベストプラクティスです。

## Step 2: 月次データの自動取得

### freee APIで取引一覧を取得

```python
# 主要なAPI呼び出し例
BASE_URL = "https://api.freee.co.jp/api/1"

# 取引一覧の取得（ページネーション対応）
response = requests.get(f"{BASE_URL}/deals", headers=headers, params={
    "company_id": company_id,
    "start_issue_date": "2026-02-01",
    "end_issue_date": "2026-02-28",
    "limit": 100, "offset": 0
})

# 試算表の取得
response = requests.get(f"{BASE_URL}/reports/trial_bs", headers=headers,
    params={"company_id": company_id, "fiscal_year": 2025,
            "start_month": 2, "end_month": 2})

# 損益計算書の取得
response = requests.get(f"{BASE_URL}/reports/trial_pl", headers=headers,
    params={"company_id": company_id, "fiscal_year": 2025,
            "start_month": 2, "end_month": 2})
```

実運用ではTokenManagerクラスでトークン自動更新、FreeeClientクラスでページネーション付き取引取得をラップすると便利です。

## Step 3: 月次決算の自動チェック

取得したデータをもとに、以下の5つのチェックを自動化します。

| チェック項目 | 内容 | 判定 |
|-------------|------|------|
| 重複仕訳 | 同日・同額・同取引先の取引を検出 | warning |
| 高額取引 | 10万円以上の取引をリストアップ | warning |
| 未分類仕訳 | 仮払・仮受・未確定の科目が残っていないか | error |
| 前月比異常 | 科目別に50%以上の変動を検出 | warning |
| 仮勘定残高 | 仮払金・仮受金・立替金・預り金の残高確認 | warning |

```python
# チェック例: 重複仕訳の検出
def check_duplicate_entries(deals):
    seen = {}
    for deal in deals:
        key = (deal["issue_date"], deal["amount"], deal["partner_name"])
        if key in seen:
            print(f"重複の可能性: {key}")
        seen[key] = deal

# チェック例: 前月比異常値の検出
def check_month_over_month(current_pl, prev_pl):
    for name, val in current_pl.items():
        prev_val = prev_pl.get(name, 0)
        if prev_val and abs(val - prev_val) / abs(prev_val) > 0.5:
            print(f"前月比異常: {name} {prev_val:,} → {val:,}")
```

## Step 4: レポート自動生成と通知

チェック結果をMarkdown形式のレポートに整形し、Slack Webhookで自動通知します。

```python
# Slack通知（レポート送信）
def send_slack_notification(webhook_url: str, report: str):
    requests.post(webhook_url, json={"text": report})
```

レポートにはステータス（OK/NG）、取引件数、エラー一覧（未整理仕訳等）、警告一覧（重複・高額・前月比異常）を含めます。

## Step 5: 定期実行の設定

cronまたはGitHub Actionsで毎月自動実行します。

```bash
# cron: 毎月5日9:00に前月チェック
0 9 5 * * cd /path/to/project && python monthly_closing_check.py
```

GitHub Actionsの場合は`schedule`トリガー（`cron: '0 0 5 * *'`）で毎月5日に実行し、`secrets`でClient ID/Secret/Webhook URLを管理します。

## 応用: 取引の自動登録

freee APIの`POST /api/1/deals`で取引を自動登録できます。銀行CSVやクレジットカード明細を解析し、`account_item_id`（勘定科目）と`tax_code`（税区分）を指定して登録します。

## セキュリティに関する注意

1. **トークンの安全な保管**: `.freee_tokens.json`は`.gitignore`に追加
2. **環境変数の使用**: Client ID/Secretは`.env`ファイルで管理
3. **最小権限の原則**: APIアプリの権限は必要最小限に設定
4. **ログの管理**: 金額・取引先名を含むログの保管に注意
5. **トークンローテーション**: リフレッシュトークンを定期更新

## まとめ

freee/MFのAPIを活用すれば、月次決算の以下の作業を自動化できます：

- **取引データの一括取得**: 手動ダウンロード不要
- **異常値の自動検出**: 重複・高額取引・前月比異常を即座にキャッチ
- **仮勘定の残高チェック**: 未整理の仕訳を自動検出
- **レポートの自動生成**: 月次決算の状況をSlackに自動通知
- **取引の自動登録**: 定型取引の記帳を完全自動化

エンジニアの強みを活かして、経理作業を「手作業」から「コードで解決する問題」に変換しましょう。

> **免責事項**: 本記事のコード例は教育目的のサンプルです。本番環境での使用にあたっては、エラーハンドリング・レート制限対応・データ検証を十分に実装してください。また、APIで自動登録した取引の正確性は必ず税理士・公認会計士に確認してください。

---

**クラウド会計ソフトのAPI連携を始めませんか？**

- [freee会計を無料で試す](https://px.a8.net/svt/ejp?a8mat=4AZ8K2+FBBEYA+3SPO+9FL80Y) -- 充実したREST APIでエンジニアの経理自動化を強力サポート
- [マネーフォワード確定申告を無料で試す](https://px.a8.net/svt/ejp?a8mat=4AZ8K2+FCIA5U+4JGQ+BZ8OY) -- API連携で月次決算の自動化を実現

---

*この記事はAIによる自動収集・要約をベースに、CPA試験合格者が監修しています。*
