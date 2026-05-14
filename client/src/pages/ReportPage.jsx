import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import {
  ArrowLeft, Download, FileDown, Loader2, AlertCircle, Users,
  MessageSquare, TrendingUp, Sparkles, ChevronDown, ChevronUp, Star,
  List, BarChart2, Hash
} from 'lucide-react'
import { SentimentDoughnut, ThemesBarChart, RatingBarChart, MultiChoiceChart } from '../components/Charts'
import ActionItems from '../components/ActionItems'
import QuoteCard from '../components/QuoteCard'

const TYPE_ICONS = { rating: Star, multiple_choice: List, short_text: MessageSquare, timestamp: Hash }
const TYPE_LABELS = { rating: 'Rating', multiple_choice: 'Multiple Choice', short_text: 'Open Text', timestamp: 'Timestamp', unknown: 'Other' }

function QuestionCard({ q }) {
  const [expanded, setExpanded] = useState(false)
  const Icon = TYPE_ICONS[q.type] || Hash
  const hasText = q.type === 'short_text'
  const hasChart = q.type === 'rating' || q.type === 'multiple_choice'

  return (
    <div className="glass-card p-6 space-y-4 animate-slide-up">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary-600/20 flex items-center justify-center shrink-0 mt-0.5">
            <Icon className="w-4 h-4 text-primary-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-dark-100 leading-snug break-words">{q.column}</p>
            <span className="text-xs text-dark-500 mt-0.5 inline-block">{TYPE_LABELS[q.type] || 'Other'} • {q.responses?.length || 0} responses</span>
          </div>
        </div>
      </div>

      {/* Sentiment mini-bar for text questions */}
      {hasText && q.sentimentSummary && (
        <div className="space-y-2">
          <p className="text-xs text-dark-400 font-medium uppercase tracking-wider">Sentiment</p>
          <div className="flex gap-2">
            {['positive', 'neutral', 'negative'].map((s) => {
              const total = (q.sentimentSummary.positive + q.sentimentSummary.neutral + q.sentimentSummary.negative) || 1
              const pct = Math.round((q.sentimentSummary[s] / total) * 100)
              const cls = { positive: 'bg-emerald-500', neutral: 'bg-yellow-400', negative: 'bg-red-400' }
              return (
                <div key={s} className="flex-1">
                  <div className="h-1.5 rounded-full bg-dark-700 overflow-hidden">
                    <div className={`h-full ${cls[s]} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-dark-400 mt-1">{s.charAt(0).toUpperCase() + s.slice(1)} {pct}%</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Keywords */}
      {hasText && q.topKeywords?.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-dark-400 font-medium uppercase tracking-wider">Top Keywords</p>
          <div className="flex flex-wrap gap-2">
            {q.topKeywords.slice(0, 8).map((kw, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-primary-600/15 border border-primary-500/20 text-primary-300 text-xs">
                {kw.word} <span className="text-primary-500">×{kw.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Chart */}
      {hasChart && (
        <div className="pt-2">
          {q.type === 'rating' && <RatingBarChart question={q} />}
          {q.type === 'multiple_choice' && <MultiChoiceChart question={q} />}
        </div>
      )}

      {/* Representative Quotes toggle */}
      {hasText && q.representativeQuotes?.length > 0 && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {expanded ? 'Hide' : 'Show'} representative quotes ({q.representativeQuotes.length})
          </button>
          {expanded && (
            <div className="mt-3">
              <QuoteCard quotes={q.representativeQuotes} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ReportPage() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [exporting, setExporting] = useState(false)
  const reportRef = useRef(null)

  useEffect(() => {
    axios.get(`/api/report/${id}`)
      .then(({ data }) => { setReport(data); setLoading(false) })
      .catch((err) => { setError(err.response?.data?.error || 'Report not found.'); setLoading(false) })
  }, [id])

  const exportPDF = async () => {
    setExporting(true)
    try {
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: '#020617',
        scale: 1.5,
        useCORS: true,
        logging: false,
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      const imgH = (canvas.height * pageW) / canvas.width
      let y = 0

      while (y < imgH) {
        pdf.addImage(imgData, 'PNG', 0, -y, pageW, imgH)
        y += pageH
        if (y < imgH) pdf.addPage()
      }

      pdf.save(`mirascope-report-${id.slice(0, 8)}.pdf`)
    } catch (e) {
      console.error('PDF export failed:', e)
    } finally {
      setExporting(false)
    }
  }

  const exportCSV = () => {
    window.location.href = `/api/report/${id}/export-csv`
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] gap-3 text-dark-400">
      <Loader2 className="w-6 h-6 animate-spin text-primary-400" />
      <span>Loading report...</span>
    </div>
  )

  if (error) return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center space-y-4">
      <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
      <h2 className="text-xl font-semibold text-dark-200">Report not found</h2>
      <p className="text-dark-400">{error}</p>
      <Link to="/" className="btn-primary inline-flex items-center gap-2 mx-auto">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
    </div>
  )

  const { overallSentiment, topThemes, suggestedActions, geminiInsights, questions, totalResponses, fileName, createdAt } = report

  const textQuestions = questions.filter((q) => q.type === 'short_text')
  const otherQuestions = questions.filter((q) => q.type !== 'short_text' && q.type !== 'timestamp')

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4">
          <Link to="/" className="btn-secondary !px-3 !py-3">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display font-bold text-2xl gradient-text">Feedback Report</h1>
            <p className="text-dark-400 text-sm mt-1">{fileName} • {new Date(createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="btn-secondary flex items-center gap-2 text-sm">
            <FileDown className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={exportPDF} disabled={exporting} className="btn-primary flex items-center gap-2 text-sm">
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {exporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Report Content (captured for PDF) */}
      <div ref={reportRef} className="space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Responses', value: totalResponses, icon: Users, color: 'text-primary-400' },
            { label: 'Questions Analyzed', value: questions.length, icon: BarChart2, color: 'text-purple-400' },
            { label: 'Open-Text Questions', value: textQuestions.length, icon: MessageSquare, color: 'text-blue-400' },
            { label: 'Top Themes Found', value: topThemes?.length || 0, icon: TrendingUp, color: 'text-emerald-400' },
          ].map((s, i) => (
            <div key={i} className="stat-card animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <div className="font-display font-bold text-3xl text-dark-100">{s.value}</div>
              <div className="text-dark-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Gemini Insights */}
        {geminiInsights && (
          <div className="glass-card p-6 border-primary-500/20 bg-primary-600/5 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary-400" />
              <h2 className="section-title">AI Executive Summary</h2>
            </div>
            <p className="text-dark-300 leading-relaxed">{geminiInsights}</p>
          </div>
        )}

        {/* 2-col: Sentiment + Themes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 space-y-4">
            <h2 className="section-title">
              <span className="text-2xl">😊</span> Sentiment Distribution
            </h2>
            <SentimentDoughnut
              positive={overallSentiment?.positive || 0}
              neutral={overallSentiment?.neutral || 0}
              negative={overallSentiment?.negative || 0}
            />
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { label: 'Positive', val: overallSentiment?.positive || 0, cls: 'badge-positive' },
                { label: 'Neutral', val: overallSentiment?.neutral || 0, cls: 'badge-neutral' },
                { label: 'Negative', val: overallSentiment?.negative || 0, cls: 'badge-negative' },
              ].map((s) => (
                <div key={s.label} className={`${s.cls} flex-col gap-0.5 py-2`}>
                  <span className="text-lg font-bold">{s.val}</span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
            <h2 className="section-title">
              <span className="text-2xl">🔍</span> Top Themes
            </h2>
            <ThemesBarChart themes={topThemes} />
          </div>
        </div>

        {/* Action Items */}
        {suggestedActions?.length > 0 && (
          <div className="space-y-4">
            <h2 className="section-title">
              <span className="text-2xl">🎯</span> Suggested Actions
            </h2>
            <ActionItems actions={suggestedActions} />
          </div>
        )}

        {/* Representative Quotes per theme */}
        {topThemes?.some((t) => t.quotes?.length > 0) && (
          <div className="space-y-4">
            <h2 className="section-title">
              <span className="text-2xl">💬</span> Representative Quotes by Theme
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topThemes.filter((t) => t.quotes?.length > 0).slice(0, 4).map((theme, i) => (
                <div key={i} className="glass-card p-5 space-y-3">
                  <p className="font-semibold text-dark-200 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-primary-400" />
                    {theme.theme.charAt(0).toUpperCase() + theme.theme.slice(1)}
                    <span className="badge bg-dark-700 text-dark-300 border-0">{theme.count} mentions</span>
                  </p>
                  <QuoteCard quotes={theme.quotes} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Per-Question Breakdown */}
        <div className="space-y-4">
          <h2 className="section-title">
            <span className="text-2xl">📊</span> Question Breakdown
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[...otherQuestions, ...textQuestions].map((q, i) => (
              <QuestionCard key={i} q={q} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
