'use client';

import { useState, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import dynamic from 'next/dynamic';
import { useLanguage } from './contexts/LanguageContext';

// Import Prism theme
import 'prismjs/themes/prism-tomorrow.min.css';

// Import Sidebar and types
import Sidebar from './components/Sidebar';
import { Article as ArticleType } from './types/article';
import TopPage from './components/TopPage';

// Initialize Prism on the client side only
let prismInstance: any;
if (typeof window !== 'undefined') {
  prismInstance = require('prismjs');
  require('prismjs/components/prism-javascript');
  require('prismjs/components/prism-typescript');
  require('prismjs/components/prism-jsx');
  require('prismjs/components/prism-tsx');
  require('prismjs/components/prism-css');
  require('prismjs/components/prism-python');
  require('prismjs/components/prism-java');
  require('prismjs/components/prism-c');
  require('prismjs/components/prism-cpp');
  require('prismjs/components/prism-ruby');
  require('prismjs/components/prism-rust');
  require('prismjs/components/prism-go');
  require('prismjs/components/prism-bash');
  require('prismjs/components/prism-json');
  require('prismjs/components/prism-yaml');
  require('prismjs/components/prism-markdown');
  require('prismjs/components/prism-sql');
  require('prismjs/components/prism-php');
}

const markdownExample = `# Markdown Example

## Text Formatting

**Bold text** and *italic text* and ~~strikethrough~~

## Lists

Unordered list:
- Item 1
- Item 2
  - Nested item
  - Another nested item
- Item 3

Ordered list:
1. First item
2. Second item
3. Third item

## Code

Inline \`code\` example

\`\`\`javascript
// Code block example
function hello(name) {
  console.log(\`Hello, \${name}!\`);
}

hello('world');
\`\`\`

## Links and Images

[Link to Google](https://google.com)

![Image alt text](https://picsum.photos/200/100)

## Blockquotes

> This is a blockquote
> It can span multiple lines
> And have *formatting* inside

## Tables

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

## Task Lists

- [x] Completed task
- [ ] Incomplete task
- [ ] Another task

## Horizontal Rule

---

## Footnotes

Here's a sentence with a footnote[^1].

[^1]: This is the footnote.
`;

// Add storage key constant
const STORAGE_KEY_PREFIX = 'article_content_';

// Format date to JST timestamp
const formatJSTDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
};

// Helper function to determine grid columns based on visibility
function getGridColumns(showEditor: boolean, showPreview: boolean) {
  if (showEditor && showPreview) return 'grid-cols-2';
  if (showEditor || showPreview) return 'grid-cols-1';
  return '';
}

export default function Home() {
  const [selectedArticle, setSelectedArticle] = useState<ArticleType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showEditor, setShowEditor] = useState(true);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'articles'>('home');
  const { t } = useLanguage();

  // Load saved content when article is selected
  useEffect(() => {
    if (selectedArticle?.id) {
      const savedContent = localStorage.getItem(STORAGE_KEY_PREFIX + selectedArticle.id);
      if (savedContent && savedContent !== selectedArticle.content) {
        setSelectedArticle(prev => ({
          ...prev!,
          content: savedContent
        }));
      }
    }
  }, [selectedArticle?.id]);

  // Save content to localStorage whenever it changes
  useEffect(() => {
    if (selectedArticle?.id && selectedArticle?.content !== undefined) {
      const currentContent = localStorage.getItem(STORAGE_KEY_PREFIX + selectedArticle.id);
      if (currentContent !== selectedArticle.content) {
        localStorage.setItem(STORAGE_KEY_PREFIX + selectedArticle.id, selectedArticle.content);
        setIsSaving(true);
        const timer = setTimeout(() => {
          setIsSaving(false);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedArticle?.content, selectedArticle?.id]);

  // Initialize Prism when the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && prismInstance) {
      // Initialize Prism
      prismInstance.manual = true;
      // Highlight all code blocks
      requestAnimationFrame(() => {
        document.querySelectorAll('code[class*="language-"]').forEach((block) => {
          prismInstance.highlightElement(block);
        });
      });
    }
  }, []);

  // Update highlighting when content changes
  useEffect(() => {
    if (typeof window !== 'undefined' && prismInstance && selectedArticle?.content) {
      requestAnimationFrame(() => {
        document.querySelectorAll('code[class*="language-"]').forEach((block) => {
          prismInstance.highlightElement(block);
        });
      });
    }
  }, [selectedArticle?.content]);

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;
      
      // If there's a selection, indent/unindent multiple lines
      if (start !== end) {
        const selectedText = value.slice(start, end);
        const lines = selectedText.split('\n');
        const allLines = value.split('\n');
        const startLineIndex = value.slice(0, start).split('\n').length - 1;
        
        let modifiedLines;
        let startOffset = 0;
        let endOffset = 0;
        
        if (e.shiftKey) {
          // Unindent: Remove 2 spaces from the start of each line if they exist
          modifiedLines = lines.map((line, i) => {
            if (line.startsWith('  ')) {
              if (i === 0) startOffset = -2;
              endOffset -= 2;
              return line.slice(2);
            }
            return line;
          });
        } else {
          // Indent: Add 2 spaces to the start of each line
          modifiedLines = lines.map((line, i) => {
            if (i === 0) startOffset = 2;
            endOffset += 2;
            return '  ' + line;
          });
        }

        const newValue = [
          ...allLines.slice(0, startLineIndex),
          ...modifiedLines,
          ...allLines.slice(startLineIndex + lines.length)
        ].join('\n');

        setSelectedArticle({ ...selectedArticle!, content: newValue });
        
        // Need to wait for the next tick to set the selection
        setTimeout(() => {
          target.selectionStart = Math.max(0, start + startOffset);
          target.selectionEnd = Math.max(0, end + endOffset);
        }, 0);
      } else {
        // Single line indentation/unindentation
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = value.indexOf('\n', start);
        const line = value.slice(lineStart, lineEnd === -1 ? value.length : lineEnd);
        
        if (e.shiftKey && line.startsWith('  ')) {
          // Remove 2 spaces if they exist at the start of the line
          const newValue = value.slice(0, lineStart) + line.slice(2) + value.slice(lineEnd === -1 ? value.length : lineEnd);
          setSelectedArticle({ ...selectedArticle!, content: newValue });
          setTimeout(() => {
            target.selectionStart = target.selectionEnd = Math.max(start - 2, lineStart);
          }, 0);
        } else if (!e.shiftKey) {
          // Add 2 spaces at cursor position
          const newValue = value.slice(0, start) + '  ' + value.slice(end);
          setSelectedArticle({ ...selectedArticle!, content: newValue });
          setTimeout(() => {
            target.selectionStart = target.selectionEnd = start + 2;
          }, 0);
        }
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        onArticleSelect={setSelectedArticle} 
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />
      <main className="flex-1 ml-80 p-8">
        {currentPage === 'home' ? (
          <TopPage />
        ) : (
          selectedArticle ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-4">
                  <h1 className="text-3xl font-bold text-gray-800">{selectedArticle.title}</h1>
                  <span className="text-gray-400 text-sm font-mono">
                    {formatJSTDate(selectedArticle.createdAt.toString())}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-sm ${isSaving ? 'text-blue-500' : 'text-green-500'}`}>
                    {t(isSaving ? 'common.saving' : 'common.saved')}
                  </span>
                  <div className="relative">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedArticle.content);
                        setShowCopyNotification(true);
                        setTimeout(() => setShowCopyNotification(false), 2000);
                      }}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      {t('common.copyText')}
                    </button>
                    {showCopyNotification && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-sm rounded shadow-lg whitespace-nowrap">
                        {t('common.copied')}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowEditor(!showEditor)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                    {t(showEditor ? 'common.hideEditor' : 'common.showEditor')}
                  </button>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                    {t(showPreview ? 'common.hidePreview' : 'common.showPreview')}
                  </button>
                </div>
              </div>

              <div className={`grid gap-6 ${getGridColumns(showEditor, showPreview)}`}>
                {showEditor && (
                  <div className="space-y-2">
                    <h2 className="text-sm font-semibold text-gray-600">Editor</h2>
                    <textarea
                      className="w-full h-[calc(100vh-14rem)] p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                      placeholder={markdownExample}
                      value={selectedArticle.content}
                      onChange={(e) => setSelectedArticle({ ...selectedArticle, content: e.target.value })}
                      onKeyDown={handleEditorKeyDown}
                    />
                  </div>
                )}

                {showPreview && (
                  <div className="space-y-2">
                    <h2 className="text-sm font-semibold text-gray-600">Preview</h2>
                    <div className="w-full h-[calc(100vh-14rem)] overflow-y-auto border border-gray-200 rounded-lg bg-white">
                      <article className="prose prose-sm max-w-none p-4">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkBreaks]}
                          rehypePlugins={[rehypeRaw, rehypeSlug, rehypeAutolinkHeadings]}
                          components={{
                            code: ({ node, inline, className, children, ...props }) => {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <pre className={`language-${match[1]}`}>
                                  <code className={`language-${match[1]}`} {...props}>
                                    {String(children).replace(/\n$/, '')}
                                  </code>
                                </pre>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            },
                            pre: ({ children }) => <>{children}</>,
                            input: ({ type, checked, ...props }) => (
                              <input type={type} checked={checked} readOnly {...props} />
                            ),
                          }}
                        >
                          {selectedArticle.content || 'Start writing your article using markdown...'}
                        </ReactMarkdown>
                      </article>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{t('common.yourArticles')}</h1>
              <p className="mt-4 text-gray-600">{t('common.selectArticle')}</p>
            </div>
          )
        )}
      </main>
    </div>
  );
}
