# Markdown Editor with Next.js
# Next.js製マークダウンエディター

A modern markdown editor built with Next.js that supports syntax highlighting and local storage persistence. The application allows you to create, edit, and manage multiple articles with a clean and intuitive interface.

Next.jsで構築された最新のマークダウンエディターです。シンタックスハイライトとローカルストレージの永続化をサポートしています。クリーンで直感的なインターフェースで、複数の記事の作成、編集、管理が可能です。

## Features / 機能

### English
- Create and manage multiple articles
- Real-time markdown preview
- Syntax highlighting for code blocks using Prism.js
- Complete local storage persistence
  - Article content and metadata
  - Last selected article restoration
  - Automatic content saving
  - Clean removal of deleted articles
- Modern UI features
  - Clean and responsive design with Tailwind CSS
  - Loading states and indicators
  - Copy to clipboard functionality
  - Save status indicators
  - Dark theme support
  - Language switching (English/Japanese)
- Code editing features
  - Tab indentation support
  - Multi-line indentation
  - Syntax highlighting for multiple languages
  - Code block copy buttons

### 日本語
- 複数記事の作成と管理
- リアルタイムマークダウンプレビュー
- Prism.jsによるコードブロックのシンタックスハイライト
- 完全なローカルストレージの永続化
  - 記事のコンテンツとメタデータ
  - 最後に選択した記事の復元
  - 自動コンテンツ保存
  - 削除記事のクリーンな除去
- モダンなUI機能
  - Tailwind CSSによるクリーンでレスポンシブなデザイン
  - ローディング状態とインジケーター
  - クリップボードへのコピー機能
  - 保存状態インジケーター
  - ダークテーマ対応
  - 言語切り替え（日本語/英語）
- コード編集機能
  - タブインデントのサポート
  - 複数行インデント
  - 複数言語のシンタックスハイライト
  - コードブロックのコピーボタン

## Getting Started / 始め方

First, run the development server:
最初に、開発サーバーを起動します：

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
ブラウザで[http://localhost:3000](http://localhost:3000)を開いて結果を確認してください。

## Project Structure / プロジェクト構造

- `app/page.tsx` - Main editor component with markdown preview / マークダウンプレビュー付きのメインエディターコンポーネント
- `app/components/` - React components / Reactコンポーネント
  - `TodoList.tsx` - Article list management and persistence / 記事リストの管理と永続化
  - `Todo.tsx` - Individual article component / 個別記事のコンポーネント
  - `Sidebar.tsx` - Navigation sidebar / ナビゲーションサイドバー
- `app/types/` - TypeScript type definitions / TypeScript型定義
- `app/i18n/` - Internationalization files / 国際化ファイル
- `app/contexts/` - React contexts / Reactコンテキスト

## Technologies Used / 使用技術

- [Next.js](https://nextjs.org) - React framework / Reactフレームワーク
- [React Markdown](https://github.com/remarkjs/react-markdown) - Markdown rendering / マークダウンレンダリング
- [Prism.js](https://prismjs.com) - Syntax highlighting / シンタックスハイライト
- [Tailwind CSS](https://tailwindcss.com) - Styling / スタイリング
- [TypeScript](https://www.typescriptlang.org) - Type safety / 型安全性

## Features in Detail / 機能の詳細

### Persistence / 永続化
- Articles and their content are automatically saved to localStorage / 記事とそのコンテンツは自動的にlocalStorageに保存
- Content is saved separately for each article to optimize performance / パフォーマンスを最適化するため、コンテンツは記事ごとに個別に保存
- Last selected article is remembered across page reloads / ページの再読み込み時に最後に選択した記事を記憶
- Complete cleanup when articles are deleted / 記事削除時の完全なクリーンアップ

### Editor Features / エディター機能
- Real-time markdown preview / リアルタイムマークダウンプレビュー
- Support for GitHub Flavored Markdown / GitHub Flavored Markdownのサポート
- Code block syntax highlighting for multiple languages / 複数言語のコードブロックシンタックスハイライト
- Tab indentation support for both single and multiple lines / 単一行と複数行のタブインデントサポート
- Copy to clipboard functionality for both articles and code blocks / 記事とコードブロックのクリップボードへのコピー機能

### UI/UX Features / UI/UX機能
- Loading states during article retrieval / 記事取得中のローディング状態
- Save status indicators / 保存状態インジケーター
- Clean and responsive sidebar navigation / クリーンでレスポンシブなサイドバーナビゲーション
- Dark theme support / ダークテーマ対応
- Language switching between English and Japanese / 日本語と英語の言語切り替え
- Modern and intuitive interface / モダンで直感的なインターフェース

## Learn More / もっと詳しく

To learn more about Next.js, take a look at the following resources:
Next.jsについてもっと詳しく知るには、以下のリソースをご覧ください：

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API / Next.jsの機能とAPIについて学ぶ
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial / インタラクティブなNext.jsチュートリアル

## Deploy on Vercel / Vercelへのデプロイ

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
Next.jsアプリをデプロイする最も簡単な方法は、Next.jsの作者が提供する[Vercelプラットフォーム](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)を使用することです。

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
詳細については、[Next.jsデプロイメントドキュメント](https://nextjs.org/docs/app/building-your-application/deploying)をご確認ください。
