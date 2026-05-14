import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { History, FileText, Loader2, AlertCircle, Trash2, ExternalLink, Users } from 'lucide-react'

export default function HistoryPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchReports = () => {
    axios.get('/api/report')
      .then(({ data }) => { setReports(data); setLoading(false) })
      .catch((err) => { setError(err.message); setLoading(false) })
  }

  useEffect(() => { fetchReports() }, [])

  const deleteReport = async (id) => {
    if (!confirm('Delete this report?')) return
    await axios.delete(`/api/report/${id}`)
    setReports((prev) => prev.filter((r) => r.reportId !== id))
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] gap-3 text-dark-400">
      <Loader2 className="w-6 h-6 animate-spin text-primary-400" />
      Loading history...
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center gap-3">
        <History className="w-7 h-7 text-primary-400" />
        <h1 className="font-display font-bold text-3xl gradient-text">Report History</h1>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {reports.length === 0 ? (
        <div className="glass-card p-16 text-center space-y-4">
          <FileText className="w-12 h-12 text-dark-500 mx-auto" />
          <p className="text-dark-400 text-lg">No reports yet</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2 mx-auto">
            Analyze your first CSV
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r, i) => (
            <div
              key={r.reportId}
              className="glass-card-hover p-5 flex items-center justify-between gap-4 flex-wrap animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-primary-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-dark-100 truncate">{r.fileName}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-dark-400 text-xs">
                      <Users className="w-3 h-3" /> {r.totalResponses} responses
                    </span>
                    <span className="text-dark-500 text-xs">
                      {new Date(r.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/report/${r.reportId}`}
                  className="btn-primary !px-4 !py-2 text-sm flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View
                </Link>
                <button
                  onClick={() => deleteReport(r.reportId)}
                  className="btn-secondary !px-4 !py-2 text-sm flex items-center gap-2 hover:!border-red-500/40 hover:!text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
