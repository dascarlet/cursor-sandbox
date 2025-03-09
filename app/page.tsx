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
import { Todo as TodoType } from './types/todo';
import TopPage from './components/TopPage';

// Initialize Prism on the client side only
let Prism: any;
if (typeof window !== 'undefined') {
  Prism = require('prismjs');
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
const STORAGE_KEY_PREFIX = 'todo_content_';

// Format date to JST timestamp
const formatJSTDate = (date: Date) => {
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
  const [selectedTodo, setSelectedTodo] = useState<TodoType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showEditor, setShowEditor] = useState(true);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'articles'>('home');
  const { t } = useLanguage();

  // Load saved content when todo is selected
  useEffect(() => {
    if (selectedTodo?.id) {
      const savedContent = localStorage.getItem(STORAGE_KEY_PREFIX + selectedTodo.id);
      if (savedContent && savedContent !== selectedTodo.content) {
        setSelectedTodo(prev => ({
          ...prev!,
          content: savedContent
        }));
      }
    }
  }, [selectedTodo?.id]);

  // Save content to localStorage whenever it changes
  useEffect(() => {
    if (selectedTodo?.id && selectedTodo?.content !== undefined) {
      const currentContent = localStorage.getItem(STORAGE_KEY_PREFIX + selectedTodo.id);
      if (currentContent !== selectedTodo.content) {
        localStorage.setItem(STORAGE_KEY_PREFIX + selectedTodo.id, selectedTodo.content);
        setIsSaving(true);
        const timer = setTimeout(() => {
          setIsSaving(false);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedTodo?.content, selectedTodo?.id]);

  // Initialize Prism when the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && Prism) {
      // Initialize Prism
      Prism.manual = true;
      // Highlight all code blocks
      requestAnimationFrame(() => {
        document.querySelectorAll('code[class*="language-"]').forEach((block) => {
          Prism.highlightElement(block);
        });
      });
    }
  }, []); // Run once on mount

  // Update highlighting when content changes
  useEffect(() => {
    if (typeof window !== 'undefined' && Prism && selectedTodo?.content) {
      requestAnimationFrame(() => {
        document.querySelectorAll('code[class*="language-"]').forEach((block) => {
          Prism.highlightElement(block);
        });
      });
    }
  }, [selectedTodo?.content]);

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

        setSelectedTodo({ ...selectedTodo!, content: newValue });
        
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
          setSelectedTodo({ ...selectedTodo!, content: newValue });
          setTimeout(() => {
            target.selectionStart = target.selectionEnd = Math.max(start - 2, lineStart);
          }, 0);
        } else if (!e.shiftKey) {
          // Add 2 spaces at cursor position
          const newValue = value.slice(0, start) + '  ' + value.slice(end);
          setSelectedTodo({ ...selectedTodo!, content: newValue });
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
        onTodoSelect={setSelectedTodo} 
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />
      <main className="flex-1 ml-80 p-8">
        {currentPage === 'home' ? (
          <TopPage />
        ) : (
          selectedTodo ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-4">
                  <h1 className="text-3xl font-bold text-gray-800">{selectedTodo.title}</h1>
                  <span className="text-gray-400 text-sm font-mono">
                    {formatJSTDate(selectedTodo.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-sm ${isSaving ? 'text-blue-500' : 'text-green-500'}`}>
                    {t(isSaving ? 'common.saving' : 'common.saved')}
                  </span>
                  <div className="relative">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedTodo.content);
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
                      value={selectedTodo.content}
                      onChange={(e) => setSelectedTodo({ ...selectedTodo, content: e.target.value })}
                      onKeyDown={handleEditorKeyDown}
                    />
                  </div>
                )}
                
                {showPreview && (
                  <div className="space-y-2">
                    <h2 className="text-sm font-semibold text-gray-600">Preview</h2>
                    <div className="w-full h-[calc(100vh-14rem)] border border-gray-200 rounded-lg overflow-y-auto bg-white">
                      <div className="p-6">
                        <article className="prose prose-sm max-w-none 
                          prose-headings:font-bold prose-headings:text-gray-800 prose-headings:mt-8 prose-headings:mb-4
                          prose-h1:text-4xl prose-h1:font-extrabold prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-4 prose-h1:mb-6
                          prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4
                          prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
                          prose-p:my-3 prose-p:text-gray-600
                          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                          prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
                          prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg
                          prose-code:text-blue-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                          prose-strong:text-gray-800 prose-strong:font-semibold
                          prose-img:rounded-lg prose-img:shadow-md
                          prose-hr:my-8 prose-hr:border-gray-200
                          prose-ul:my-3 prose-ol:my-3 prose-li:my-1
                          [&>ul]:list-disc [&>ul]:pl-6 
                          [&>ol]:list-decimal [&>ol]:pl-6
                          [&_ul]:list-disc [&_ul]:pl-6 
                          [&_ol]:list-decimal [&_ol]:pl-6
                          [&_li]:pl-2
                          [&_li]:marker:text-gray-400
                          [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-gray-300
                          [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-100 [&_th]:p-2 [&_th]:text-left
                          [&_td]:border [&_td]:border-gray-300 [&_td]:p-2
                          [&_table]:overflow-x-auto [&_table]:block [&_table]:whitespace-nowrap
                        ">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            rehypePlugins={[rehypeRaw, rehypeSlug, rehypeAutolinkHeadings]}
                            components={{
                              h1: ({ node, ...props }) => (
                                <h1 className="text-4xl font-extrabold text-gray-800 border-b border-gray-200 pb-4 mb-6 mt-8" {...props} />
                              ),
                              h2: ({ node, ...props }) => (
                                <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4" {...props} />
                              ),
                              h3: ({ node, ...props }) => (
                                <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-3" {...props} />
                              ),
                              code: ({ className, children, ...props }) => {
                                const match = /language-(\w+)/.exec(className || '');
                                const language = match ? match[1] : '';
                                const isInline = !match;
                                
                                if (!isInline && language) {
                                  return (
                                    <div className="relative group">
                                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                          onClick={() => {
                                            navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                                          }}
                                          className="px-2 py-1 text-xs text-gray-400 hover:text-gray-300 bg-gray-800 rounded"
                                        >
                                          Copy
                                        </button>
                                      </div>
                                      <pre className="!p-0 !m-0 overflow-hidden rounded-lg">
                                        <code className={`language-${language} !bg-[#1d1f21] block p-4 overflow-x-auto`}>
                                          {children}
                                        </code>
                                      </pre>
                                    </div>
                                  );
                                }
                                
                                return (
                                  <code className="px-1.5 py-0.5 text-blue-600 bg-gray-100 rounded" {...props}>
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
                            {selectedTodo.content || 'Start writing your article using markdown...'}
                          </ReactMarkdown>
                        </article>
                      </div>
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
