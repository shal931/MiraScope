import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2,
  Sparkles, ArrowRight, X
} from 'lucide-react'

export default function UploadZone() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const onDrop = useCallback((accepted, rejected) => {
    setError(null)
    if (rejected.length > 0) {
      setError('Only CSV files are accepted. Please upload a valid .csv file.')
      return
    }
    if (accepted.length > 0) setFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
      'application/csv': ['.csv'],
      'text/plain': ['.csv']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('csv', file)

    try {
      const { data } = await axios.post('/api/upload', formData, {
      })
      navigate(`/report/${data.reportId}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.')
      setLoading(false)
    }
  }

  const removeFile = (e) => {
    e.stopPropagation()
    setFile(null)
    setError(null)
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300
          ${isDragActive
            ? 'border-primary-400 bg-primary-500/10 dropzone-active'
            : file
            ? 'border-emerald-500/50 bg-emerald-500/5'
            : 'border-dark-600 bg-dark-800/50 hover:border-primary-500/50 hover:bg-dark-800'
          }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          {/* Icon */}
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            file
              ? 'bg-emerald-500/20 border border-emerald-500/30'
              : isDragActive
              ? 'bg-primary-500/20 border border-primary-500/30'
              : 'bg-dark-700 border border-dark-600'
          }`}>
            {file
              ? <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              : isDragActive
              ? <UploadCloud className="w-10 h-10 text-primary-400 animate-bounce" />
              : <UploadCloud className="w-10 h-10 text-dark-400" />
            }
          </div>

          {file ? (
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <p className="font-semibold text-emerald-400">{file.name}</p>
                <button onClick={removeFile} className="text-dark-400 hover:text-red-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-dark-400 text-sm">{(file.size / 1024).toFixed(1)} KB • Ready to analyze</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="font-semibold text-dark-200 text-lg">
                {isDragActive ? 'Drop your CSV here!' : 'Drop your CSV or click to browse'}
              </p>
              <p className="text-dark-400 text-sm">Supports Google Forms CSV exports • Max 10MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing your feedback...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate AI Report
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      {loading && (
        <div className="text-center text-dark-400 text-sm animate-pulse">
          Running sentiment analysis, extracting themes, and generating insights...
        </div>
      )}
    </div>
  )
}
