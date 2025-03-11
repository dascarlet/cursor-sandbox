export type Language = 'en' | 'ja';

export const translations = {
  en: {
    common: {
      markdownEditor: 'Markdown Editor',
      home: 'Home',
      articles: 'Articles',
      yourArticles: 'Your Articles',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      saved: 'Saved',
      saving: 'Saving...',
      copyText: 'Copy Text',
      copied: 'Copied to clipboard!',
      hideEditor: 'Hide Editor',
      showEditor: 'Show Editor',
      hidePreview: 'Hide Preview',
      showPreview: 'Show Preview',
      addArticle: 'Add Article',
      noArticles: 'No articles yet. Add one above!',
      loading: 'Loading articles...',
      selectArticle: 'Select an article from the sidebar to start editing.',
      addArticleTitle: 'Add a new article title...',
      deleteArticle: 'Delete article',
      sortByNewest: 'Sort by newest',
      sortByOldest: 'Sort by oldest',
      switchToLightMode: 'Switch to light mode',
      switchToDarkMode: 'Switch to dark mode',
      switchLanguage: 'Switch language'
    },
    topPage: {
      welcome: 'Welcome to Markdown Editor',
      subtitle: 'A modern, feature-rich markdown editor for your writing needs',
      storageNotice: 'All data is stored locally in your browser. We do not save any data to our servers.',
      features: {
        markdownPreview: {
          title: 'Real-time Markdown Preview',
          description: 'See your markdown rendered in real-time as you type with syntax highlighting'
        },
        timestamp: {
          title: 'JST Timestamp',
          description: 'Automatic JST timestamp tracking for all your articles'
        },
        darkMode: {
          title: 'Dark Mode Support',
          description: 'Comfortable writing experience in both light and dark modes'
        },
        organization: {
          title: 'Flexible Organization',
          description: 'Sort and organize your articles by creation time'
        }
      },
      gettingStarted: {
        title: 'Getting Started',
        steps: [
          'Click on "Articles" in the sidebar to view your articles',
          'Create a new article using the "Add Article" button',
          'Write your content using markdown syntax',
          'Use the preview pane to see the rendered output',
          'Your content is automatically saved as you type'
        ]
      }
    }
  },
  ja: {
    common: {
      markdownEditor: 'マークダウン エディター',
      home: 'ホーム',
      articles: '記事一覧',
      yourArticles: 'あなたの記事',
      darkMode: 'ダークモード',
      lightMode: 'ライトモード',
      saved: '保存済み',
      saving: '保存中...',
      copyText: 'テキストをコピー',
      copied: 'クリップボードにコピーしました！',
      hideEditor: 'エディターを隠す',
      showEditor: 'エディターを表示',
      hidePreview: 'プレビューを隠す',
      showPreview: 'プレビューを表示',
      addArticle: '記事を追加',
      noArticles: 'まだ記事がありません。上のボタンから追加してください。',
      loading: '記事を読み込み中...',
      selectArticle: 'サイドバーから記事を選択して編集を開始してください。',
      addArticleTitle: '新しい記事のタイトルを入力...',
      deleteArticle: '記事を削除',
      sortByNewest: '新しい順に並べ替え',
      sortByOldest: '古い順に並べ替え',
      switchToLightMode: 'ライトモードに切り替え',
      switchToDarkMode: 'ダークモードに切り替え',
      switchLanguage: '言語を切り替え'
    },
    topPage: {
      welcome: 'マークダウン エディターへようこそ',
      subtitle: 'モダンで機能豊富なマークダウンエディターで、快適な執筆体験を',
      storageNotice: 'すべてのデータはブラウザのローカルストレージに保存されます。サーバーには一切保存されません。',
      features: {
        markdownPreview: {
          title: 'リアルタイムプレビュー',
          description: 'シンタックスハイライト付きで、入力と同時にマークダウンのプレビューを確認できます'
        },
        timestamp: {
          title: 'JST タイムスタンプ',
          description: '全ての記事に日本標準時のタイムスタンプを自動で記録'
        },
        darkMode: {
          title: 'ダークモード対応',
          description: 'ライト・ダークモードの両方で快適な執筆環境を提供'
        },
        organization: {
          title: '柔軟な整理機能',
          description: '作成時刻でソートして記事を整理'
        }
      },
      gettingStarted: {
        title: '使い方',
        steps: [
          'サイドバーの「記事一覧」をクリック',
          '「記事を追加」ボタンで新しい記事を作成',
          'マークダウン記法でコンテンツを作成',
          'プレビューペインで表示を確認',
          '入力内容は自動で保存されます'
        ]
      }
    }
  }
}; 