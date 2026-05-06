import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mt-6 mb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold mt-5 mb-2">{children}</h2>
          ),
          p: ({ children }) => (
            <p className="leading-7 mb-3">{children}</p>
          ),
          code({ className, children, ...props }: React.ComponentPropsWithoutRef<"code">) {
            const isInline = !className?.includes("language-");
            return isInline ? (
              <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props}>
                {children}
              </code>
            ) : (
              <pre className="bg-muted p-3 rounded-lg overflow-x-auto">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            )
          },
          table: ({ children }) => (
            <table className="w-full border rounded-lg overflow-hidden">
              {children}
            </table>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
