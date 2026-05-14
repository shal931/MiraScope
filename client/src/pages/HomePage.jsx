import { Telescope, Sparkles, BarChart3, FileDown, Zap, Shield } from 'lucide-react'
import UploadZone from '../components/UploadZone'

const features = [
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    desc: 'Auto-generated bar & pie charts for ratings, choices, and sentiment distribution.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Insights',
    desc: 'Gemini Flash generates executive summaries and prioritized action items.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Instant Themes',
    desc: 'TF-IDF keyword extraction surfaces the most discussed topics in seconds.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: FileDown,
    title: 'Export Reports',
    desc: 'Download polished PDF/HTML reports and annotated CSVs with one click.',
    color: 'from-emerald-500 to-teal-500',
  },
]

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-24">
      {/* Hero */}
      <section className="text-center space-y-8 animate-fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600/15 border border-primary-500/25 text-primary-300 text-sm font-medium">
          <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse-slow" />
          Powered by Gemini AI + VADER Sentiment
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-tight">
            Turn feedback into{' '}
            <span className="gradient-text">actionable insights</span>
          </h1>
          <p className="text-dark-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Upload your Google Form CSV and get sentiment analysis, top themes, 
            representative quotes, and AI-generated recommendations — in seconds.
          </p>
        </div>

        {/* Floating blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-32 left-1/4 w-64 h-64 rounded-full bg-primary-600/5 blur-3xl animate-float" />
          <div className="absolute top-48 right-1/4 w-96 h-96 rounded-full bg-purple-600/5 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>
      </section>

      {/* Upload Section */}
      <section className="animate-slide-up" id="upload">
        <div className="glass-card p-8 md:p-12 max-w-2xl mx-auto">
          <div className="text-center mb-8 space-y-2">
            <h2 className="font-display font-semibold text-2xl text-dark-100">Start Analyzing</h2>
            <p className="text-dark-400">Export your Google Form as CSV and drop it below</p>
          </div>
          <UploadZone />

          {/* CSV hint */}
          <div className="mt-6 p-4 rounded-xl bg-dark-800/50 border border-dark-700/50">
            <p className="text-dark-400 text-xs text-center">
              💡 <strong className="text-dark-300">How to export:</strong> Google Forms → Responses → ⋮ → Download responses (.csv)
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display font-bold text-3xl text-dark-100">Everything you need</h2>
          <p className="text-dark-400">From raw CSV to polished report in one step</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="glass-card-hover p-6 space-y-4 animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} p-0.5`}>
                <div className="w-full h-full rounded-[10px] bg-dark-900 flex items-center justify-center">
                  <f.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-dark-100 mb-1">{f.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sample CSV hint */}
      <section className="text-center pb-8">
        <div className="inline-block glass-card px-8 py-6 space-y-3">
          <Shield className="w-8 h-8 text-primary-400 mx-auto" />
          <h3 className="font-semibold text-dark-200">Your data stays private</h3>
          <p className="text-dark-400 text-sm max-w-sm">
            CSV files are processed on your local server and stored only in your MongoDB instance. Nothing is sent to third parties (except Gemini if configured).
          </p>
        </div>
      </section>
    </div>
  )
}
