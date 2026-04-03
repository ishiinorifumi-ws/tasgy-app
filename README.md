[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# tasgy

GitHub Issues をバックエンドにした、スマホ向けタスク管理Webアプリ。

Issue の一覧をカンバン風タブで分類し、優先度変更・メモ追記・タスク作成をすばやく行える。

## スクリーンショット

```
┌──────────────────────────┐
│ 📋 マイタスク      [＋]  │
├──────────────────────────┤
│ 🔴緊急│🟡今週│🔵次週│👀待ち│
├──────────────────────────┤
│ カテゴリ: [全て ▼]       │
│ ソート:  [作成日順 ▼]    │
├──────────────────────────┤
│ ┌────────────────────┐   │
│ │ #38 タスクタイトル   │   │
│ │ 🏢 カテゴリ 📅 4/30  │   │
│ │ [🟡今週へ] [✅完了]  │   │
│ └────────────────────┘   │
└──────────────────────────┘
```

## 機能

- **タブ切り替え** — 優先度ラベル（緊急 / 今週 / 次週以降 / 確認待ち）で分類
- **カテゴリフィルター / ソート** — カテゴリ絞り込み、期限順・作成日順で並べ替え
- **タスク詳細** — カードをタップで展開、Issue 本文とコメントを表示
- **メモ追記** — 展開内からコメントをすぐ追加
- **優先度変更** — ボタンで優先度ラベルを付け替え
- **タスク完了** — ワンタップで Issue を Close
- **新規タスク作成** — タイトル・詳細・優先度・カテゴリ・期限を指定して作成
- **期限アラート** — 3日以内 ⚠️ / 超過 🔥 を自動表示

## 技術スタック

- **React 19** + **Vite**
- **Tailwind CSS v4**
- **GitHub REST API** — Issue をデータストアとして利用
- **GitHub Pages** — 静的サイトとしてホスティング

## ラベル設定

tasgy は GitHub Issues のラベルでタスクを分類します。以下のラベルをリポジトリに作成してください。

### 優先度ラベル（必須）

アプリのタブに対応します。ラベル名は絵文字を含めて正確に一致させる必要があります。

| ラベル名 | 色 | 用途 |
|----------|------|------|
| `🔴 緊急` | `#d73a4a` | 今日〜3日以内に対応必須 |
| `🟡 今週` | `#fbca04` | 今週中に着手すべき |
| `🔵 次週以降` | `#0075ca` | 追跡が必要だが緊急でない |
| `👀 確認待ち` | `#f9d0c4` | 相手のアクション待ち |

> 優先度ラベルなしの Issue は「🟡 今週」タブに表示されます。

### ステータスラベル（任意）

| ラベル名 | 色 | 用途 |
|----------|------|------|
| `⏸️ 保留` | `#e4e669` | 一時停止中 |

### カテゴリラベル（任意・カスタマイズ可）

カテゴリラベルを作成すると、フィルター機能でタスクを絞り込めます。業務や用途に合わせて自由に設定してください。

カスタマイズする場合は `src/utils/labels.js` の `CATEGORY_LABELS` を編集します：

```js
export const CATEGORY_LABELS = [
  { name: '📧 メール', color: '#0e8a16' },
  { name: '📝 ドキュメント', color: '#d876e3' },
  { name: '💻 開発', color: '#006b75' },
  // 自由に追加・変更可能
]
```

### ラベル一括作成スクリプト

GitHub CLI でまとめて作成できます：

```bash
REPO="<your-username>/<your-repo>"

# 優先度ラベル
gh label create "🔴 緊急" --color "d73a4a" --description "今日〜3日以内に対応必須" --repo $REPO
gh label create "🟡 今週" --color "fbca04" --description "今週中に着手すべき" --repo $REPO
gh label create "🔵 次週以降" --color "0075ca" --description "追跡が必要だが緊急でない" --repo $REPO
gh label create "👀 確認待ち" --color "f9d0c4" --description "相手のアクション待ち" --repo $REPO
gh label create "⏸️ 保留" --color "e4e669" --description "一時停止中" --repo $REPO
```

## セットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/<your-username>/tasgy.git
cd tasgy
npm install
```

### 2. 環境変数を設定

`.env` ファイルをプロジェクトルートに作成:

```
VITE_REPO_OWNER=<GitHubユーザー名>
VITE_REPO_NAME=<Issueを管理するリポジトリ名>
```

### 3. GitHub Personal Access Token を作成

1. [GitHub Settings > Tokens](https://github.com/settings/tokens?type=beta) にアクセス
2. Fine-grained token を作成（`Issues: Read and write` 権限）
3. アプリ初回アクセス時にトークンを入力

### 4. 開発サーバーを起動

```bash
npm run dev
```

## デプロイ（GitHub Pages）

1. リポジトリの Settings > Pages で **Source: GitHub Actions** を選択
2. リポジトリの Settings > Secrets and variables > Actions > Variables に環境変数を追加:
   - `VITE_REPO_OWNER`
   - `VITE_REPO_NAME`
3. `main` ブランチにプッシュすると自動デプロイ

## ライセンス

MIT
