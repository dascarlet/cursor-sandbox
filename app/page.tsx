'use client';

import { useState, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import Sidebar from './components/Sidebar';
import { Todo as TodoType } from './types/todo';

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

export default function Home() {
  const [selectedTodo, setSelectedTodo] = useState<TodoType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Debounced save indicator
  useEffect(() => {
    if (selectedTodo) {
      setIsSaving(true);
      const timer = setTimeout(() => {
        setIsSaving(false);
      }, 1000);
      return () => clearTimeout(timer);
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
      <Sidebar onTodoSelect={setSelectedTodo} />
      <main className="flex-1 ml-80 p-8">
        {selectedTodo ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800">{selectedTodo.title}</h1>
              <div className="flex items-center gap-4">
                <span className={`text-sm ${isSaving ? 'text-blue-500' : 'text-green-500'}`}>
                  {isSaving ? 'Saving...' : 'Saved'}
                </span>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
              </div>
            </div>

            <div className={`grid gap-6 ${showPreview ? 'grid-cols-2' : 'grid-cols-1'}`}>
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
                        prose-table:border-collapse
                        prose-th:border prose-th:border-gray-300 prose-th:bg-gray-100 prose-th:p-2
                        prose-td:border prose-td:border-gray-300 prose-td:p-2
                        prose-img:rounded-lg prose-img:shadow-md
                        prose-hr:my-8 prose-hr:border-gray-200
                        prose-ul:my-3 prose-ol:my-3 prose-li:my-1
                        [&>ul]:list-disc [&>ul]:pl-6 
                        [&>ol]:list-decimal [&>ol]:pl-6
                        [&_ul]:list-disc [&_ul]:pl-6 
                        [&_ol]:list-decimal [&_ol]:pl-6
                        [&_li]:pl-2
                        [&_li]:marker:text-gray-400
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
            <h1 className="text-3xl font-bold text-gray-800">Welcome to Your Articles</h1>
            <p className="mt-4 text-gray-600">Select an article from the sidebar to start editing.</p>
          </div>
        )}
      </main>
    </div>
  );
}
