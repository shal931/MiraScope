import { Quote } from 'lucide-react'

export default function QuoteCard({ quotes, theme }) {
  if (!quotes || quotes.length === 0) return null
  return (
    <div className="space-y-2">
      {quotes.slice(0, 3).map((q, i) => (
        <div
          key={i}
          className="relative glass-card p-4 pl-6 border-l-2 border-primary-500/40 hover:border-primary-400 transition-colors duration-200"
        >
          <Quote className="absolute top-3 left-2 w-3 h-3 text-primary-500/60" />
          <p className="text-dark-300 text-sm italic leading-relaxed">"{q}"</p>
        </div>
      ))}
    </div>
  )
}
