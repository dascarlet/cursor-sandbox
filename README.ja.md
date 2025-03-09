# Next.js製マークダウンエディター

Next.jsで構築された最新のマークダウンエディターです。シンタックスハイライトとローカルストレージの永続化をサポートしています。クリーンで直感的なインターフェースで、複数の記事の作成、編集、管理が可能です。

## 機能

- 複数記事の作成と管理
- リアルタイムマークダウンプレビュー
- react-syntax-highlighterによるコードブロックのシンタックスハイライト
- 完全なローカルストレージの永続化
  - 記事のコンテンツとメタデータ
  - 最後に選択した記事の復元
  - 最後に訪問したページの復元
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
- リアルタイム同期
  - タイトル更新のコンポーネント間同期
  - 記事リストのリアルタイム更新
  - クロスタブ同期

## 始め方

最初に、開発サーバーを起動します：

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
# または
bun dev
```

ブラウザで[http://localhost:3000](http://localhost:3000)を開いて結果を確認してください。

## プロジェクト構造

- `app/page.tsx` - マークダウンプレビュー付きのメインエディターコンポーネント
- `app/components/` - Reactコンポーネント
  - `ArticleList.tsx` - 記事リストの管理と永続化
  - `Article.tsx` - 個別記事のコンポーネント
  - `Sidebar.tsx` - ナビゲーションサイドバー
  - `TopPage.tsx` - ホームページコンポーネント
- `app/types/` - TypeScript型定義
  - `article.ts` - 記事の型定義
- `app/i18n/` - 国際化ファイル
- `app/contexts/` - Reactコンテキスト
  - `LanguageContext.tsx` - 言語切り替えコンテキスト
  - `ThemeContext.tsx` - テーマ切り替えコンテキスト

## 使用技術

- [Next.js](https://nextjs.org) - Reactフレームワーク
- [React Markdown](https://github.com/remarkjs/react-markdown) - マークダウンレンダリング
- [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) - シンタックスハイライト
- [Tailwind CSS](https://tailwindcss.com) - スタイリング
- [TypeScript](https://www.typescriptlang.org) - 型安全性

## 機能の詳細

### 永続化
- 記事とそのコンテンツは自動的にlocalStorageに保存
- パフォーマンスを最適化するため、コンテンツは記事ごとに個別に保存
- ページの再読み込み時に最後に選択した記事を記憶
- ページの再読み込み時に最後に訪問したページを復元
- 記事削除時の完全なクリーンアップ

### エディター機能
- リアルタイムマークダウンプレビュー
- GitHub Flavored Markdownのサポート
- 複数言語のコードブロックシンタックスハイライト
- 単一行と複数行のタブインデントサポート
- 記事とコードブロックのクリップボードへのコピー機能

### UI/UX機能
- 記事取得中のローディング状態
- 保存状態インジケーター
- クリーンでレスポンシブなサイドバーナビゲーション
- ダークテーマ対応
- 日本語と英語の言語切り替え
- モダンで直感的なインターフェース

### 同期
- コンポーネント間のリアルタイムタイトル更新
- 記事変更のクロスタブ同期
- ページ再読み込み時の自動状態復元

## もっと詳しく

Next.jsについてもっと詳しく知るには、以下のリソースをご覧ください：

- [Next.js Documentation](https://nextjs.org/docs) - Next.jsの機能とAPIについて学ぶ
- [Learn Next.js](https://nextjs.org/learn) - インタラクティブなNext.jsチュートリアル

## Vercelへのデプロイ

Next.jsアプリをデプロイする最も簡単な方法は、Next.jsの作者が提供する[Vercelプラットフォーム](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)を使用することです。

詳細については、[Next.jsデプロイメントドキュメント](https://nextjs.org/docs/app/building-your-application/deploying)をご確認ください。 