import { Link, useLocation } from 'react-router-dom'
import { Telescope, History, UploadCloud } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 glass-card border-x-0 border-t-0 rounded-none px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
              <Telescope className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-dark-950 animate-pulse-slow" />
          </div>
          <div>
            <span className="font-display font-bold text-xl gradient-text">MiraScope</span>
            <p className="text-dark-400 text-xs leading-none">Feedback Summarizer</p>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive('/')
                ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                : 'text-dark-300 hover:text-dark-100 hover:bg-dark-800'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            Analyze
          </Link>
          <Link
            to="/history"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive('/history')
                ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                : 'text-dark-300 hover:text-dark-100 hover:bg-dark-800'
            }`}
          >
            <History className="w-4 h-4" />
            History
          </Link>
        </div>
      </div>
    </nav>
  )
}
