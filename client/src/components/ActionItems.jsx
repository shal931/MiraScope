import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

const priorityConfig = {
  P1: { label: 'P1 Critical', cls: 'badge-p1', icon: AlertTriangle },
  P2: { label: 'P2 Important', cls: 'badge-p2', icon: TrendingUp },
  P3: { label: 'P3 Nice-to-have', cls: 'badge-p3', icon: CheckCircle },
}

const confidenceColors = {
  High: 'text-emerald-400',
  Medium: 'text-yellow-400',
  Low: 'text-dark-400',
}

export default function ActionItems({ actions }) {
  if (!actions || actions.length === 0) return null

  return (
    <div className="space-y-3">
      {actions.map((action, i) => {
        const pCfg = priorityConfig[action.priority] || priorityConfig.P3
        const PIcon = pCfg.icon

        return (
          <div
            key={i}
            className="glass-card-hover p-5 flex gap-4 animate-fade-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Number */}
            <div className="w-8 h-8 rounded-lg bg-primary-600/20 border border-primary-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-primary-400 font-bold text-sm">{i + 1}</span>
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <p className="text-dark-100 font-medium leading-snug">{action.action}</p>
              {action.rationale && (
                <p className="text-dark-400 text-sm">{action.rationale}</p>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={pCfg.cls}>
                  <PIcon className="w-3 h-3" />
                  {pCfg.label}
                </span>
                <span className={`text-xs font-semibold ${confidenceColors[action.confidence] || 'text-dark-400'}`}>
                  {action.confidence} confidence
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
