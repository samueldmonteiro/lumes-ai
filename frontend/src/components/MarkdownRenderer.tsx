"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="max-w-full break-words overflow-wrap-break-word text-sm sm:text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-200 font-sans">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Headings with clean tight spacing
          h1: ({ children }) => (
            <h1 className="text-lg sm:text-xl font-bold font-geist mt-4.5 mb-2.5 text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-1 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base sm:text-lg font-bold font-geist mt-3.5 mb-2 text-zinc-800 dark:text-zinc-200 tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm sm:text-base font-semibold font-geist mt-3 mb-1.5 text-zinc-700 dark:text-zinc-300">
              {children}
            </h3>
          ),
          
          // Paragraphs with tight, professional margins (fixing massive whitespace spacing)
          p: ({ children }) => (
            <p className="mb-2.5 text-zinc-700 dark:text-zinc-300 last:mb-0 leading-relaxed">
              {children}
            </p>
          ),
          
          // Lists with aligned spacing
          ul: ({ children }) => (
            <ul className="list-disc list-inside pl-3.5 mb-2.5 space-y-1 text-zinc-700 dark:text-zinc-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside pl-3.5 mb-2.5 space-y-1 text-zinc-700 dark:text-zinc-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-zinc-700 dark:text-zinc-300 pl-0.5">
              {children}
            </li>
          ),

          // Explicit high-contrast customization for strong and bold text (Fixing unreadable dark text inside lists)
          strong: ({ children }) => (
            <strong className="font-semibold text-zinc-900 dark:text-white">
              {children}
            </strong>
          ),
          b: ({ children }) => (
            <b className="font-semibold text-zinc-900 dark:text-white">
              {children}
            </b>
          ),

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-violet-500/50 pl-4 py-1 my-3.5 text-zinc-700 dark:text-zinc-400 italic bg-zinc-100/50 dark:bg-zinc-900/40 rounded-r-lg pr-2">
              {children}
            </blockquote>
          ),

          // Horizontal lines
          hr: () => (
            <hr className="my-4 border-t border-zinc-200 dark:border-zinc-800" />
          ),

          // Links
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#8B5CF6] dark:text-[#a855f7] font-semibold underline underline-offset-4 hover:text-[#7c3aed] dark:hover:text-[#c084fc] transition-colors duration-200"
            >
              {children}
            </a>
          ),

          // Code block & inline code
          code({ className, children, ...props }: React.ComponentPropsWithoutRef<"code">) {
            const isInline = !className?.includes("language-");
            
            return isInline ? (
              <code 
                className="bg-zinc-200/60 dark:bg-zinc-800/80 px-1.5 py-0.5 rounded text-xs font-mono font-semibold text-violet-600 dark:text-violet-400" 
                {...props}
              >
                {children}
              </code>
            ) : (
              <pre className="bg-zinc-200 dark:bg-zinc-950/80 p-3.5 rounded-xl my-3.5 overflow-x-auto border border-zinc-200 dark:border-zinc-800 shadow-inner font-mono text-xs sm:text-sm scrollbar-thin scrollbar-thumb-zinc-700">
                <code className={`${className} block w-full text-zinc-800 dark:text-zinc-200`} {...props}>
                  {children}
                </code>
              </pre>
            );
          },

          // Tables (Fixing unreadable table headers and borders)
          table: ({ children }) => (
            <div className="w-full overflow-x-auto my-4.5 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 scrollbar-thin">
              <table className="w-full border-collapse text-left text-xs sm:text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold uppercase tracking-wider text-[10px] sm:text-xs">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-zinc-100/50 dark:hover:bg-zinc-800/20 transition-colors duration-200">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2.5 font-semibold text-zinc-800 dark:text-zinc-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 text-zinc-700 dark:text-zinc-300">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
