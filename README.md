This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


# keki-repo

Next.js（App Router）で作成されたサンプルプロジェクトです。AIチャット（OpenAI）やCSVデータビューアなどの機能を含みます。

**必要条件**

- Node.js 18 以上
- npm / pnpm / yarn

**セットアップ（ローカル開発）**

1. 依存をインストール

```bash
npm install
```

2. 開発サーバを起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いてください。

**環境変数**

AIチャットや外部検索を使う場合、ルートに `.env.local` を作成して以下を設定します。

```
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_CX=your_google_cx_here
```

**主な機能（概要）**

- ホームページ: `app/page.tsx`
- Page1: Not Found 風のページ（戻るボタン）
- Page2: プレースホルダページ
- Page3: AI 対戦のじゃんけんゲーム
- Page4: AIチャット（任意でウェブ検索統合）
- Data Viewer: `data.csv` を表示するビュー

**開発コマンド**

- `npm run dev` — 開発サーバを起動
- `npm run build` — 本番ビルド
- `npm run start` — ビルド後にサーバ起動

**デプロイ**

Vercel にデプロイするのが簡単です。詳細は Next.js のデプロイドキュメントを参照してください。

**参考**

- Next.js ドキュメント: https://nextjs.org/docs
- Next.js GitHub: https://github.com/vercel/next.js
