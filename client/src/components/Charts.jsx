import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

const SENTIMENT_COLORS = {
  positive: { bg: 'rgba(52, 211, 153, 0.8)', border: 'rgba(52, 211, 153, 1)' },
  neutral: { bg: 'rgba(251, 191, 36, 0.8)', border: 'rgba(251, 191, 36, 1)' },
  negative: { bg: 'rgba(248, 113, 113, 0.8)', border: 'rgba(248, 113, 113, 1)' },
}

const BASE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } },
    },
    tooltip: {
      backgroundColor: '#1e293b',
      borderColor: 'rgba(99,102,241,0.3)',
      borderWidth: 1,
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8',
    },
  },
}

export function SentimentDoughnut({ positive, neutral, negative }) {
  const total = positive + neutral + negative || 1
  if (total === 0) return <p className="text-dark-400 text-sm text-center py-8">No text responses to analyze.</p>

  const data = {
    labels: [
      `Positive (${Math.round((positive / total) * 100)}%)`,
      `Neutral (${Math.round((neutral / total) * 100)}%)`,
      `Negative (${Math.round((negative / total) * 100)}%)`,
    ],
    datasets: [{
      data: [positive, neutral, negative],
      backgroundColor: [SENTIMENT_COLORS.positive.bg, SENTIMENT_COLORS.neutral.bg, SENTIMENT_COLORS.negative.bg],
      borderColor: [SENTIMENT_COLORS.positive.border, SENTIMENT_COLORS.neutral.border, SENTIMENT_COLORS.negative.border],
      borderWidth: 2,
      hoverOffset: 8,
    }],
  }

  return (
    <div className="h-64">
      <Doughnut data={data} options={{ ...BASE_OPTIONS, cutout: '65%' }} />
    </div>
  )
}

export function ThemesBarChart({ themes }) {
  if (!themes || themes.length === 0) return <p className="text-dark-400 text-sm text-center py-8">No themes extracted.</p>

  const COLORS = [
    'rgba(99,102,241,0.8)', 'rgba(139,92,246,0.8)', 'rgba(236,72,153,0.8)',
    'rgba(59,130,246,0.8)', 'rgba(20,184,166,0.8)',
  ]

  const data = {
    labels: themes.map((t) => t.theme.charAt(0).toUpperCase() + t.theme.slice(1)),
    datasets: [{
      label: 'Mentions',
      data: themes.map((t) => t.count),
      backgroundColor: themes.map((_, i) => COLORS[i % COLORS.length]),
      borderColor: themes.map((_, i) => COLORS[i % COLORS.length].replace('0.8', '1')),
      borderWidth: 1,
      borderRadius: 8,
    }],
  }

  return (
    <div className="h-64">
      <Bar
        data={data}
        options={{
          ...BASE_OPTIONS,
          indexAxis: 'y',
          plugins: {
            ...BASE_OPTIONS.plugins,
            legend: { display: false },
          },
          scales: {
            x: {
              grid: { color: 'rgba(51,65,85,0.5)' },
              ticks: { color: '#94a3b8' },
            },
            y: {
              grid: { display: false },
              ticks: { color: '#cbd5e1', font: { size: 13 } },
            },
          },
        }}
      />
    </div>
  )
}

export function RatingBarChart({ question }) {
  const freq = {}
  for (const r of question.responses) {
    const v = Number(r)
    if (!isNaN(v)) freq[v] = (freq[v] || 0) + 1
  }

  const labels = Object.keys(freq).sort((a, b) => Number(a) - Number(b))
  const data = {
    labels,
    datasets: [{
      label: 'Responses',
      data: labels.map((l) => freq[l]),
      backgroundColor: labels.map((l) => {
        const v = Number(l)
        if (v >= 8) return 'rgba(52,211,153,0.8)'
        if (v >= 5) return 'rgba(251,191,36,0.8)'
        return 'rgba(248,113,113,0.8)'
      }),
      borderWidth: 0,
      borderRadius: 6,
    }],
  }

  return (
    <div className="h-48">
      <Bar
        data={data}
        options={{
          ...BASE_OPTIONS,
          plugins: { ...BASE_OPTIONS.plugins, legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(51,65,85,0.5)' }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: 'rgba(51,65,85,0.3)' }, ticks: { color: '#94a3b8', stepSize: 1 } },
          },
        }}
      />
    </div>
  )
}

export function MultiChoiceChart({ question }) {
  const freq = {}
  for (const r of question.responses) {
    const k = r.toString().trim()
    freq[k] = (freq[k] || 0) + 1
  }

  const COLORS = ['rgba(99,102,241,0.8)', 'rgba(139,92,246,0.8)', 'rgba(236,72,153,0.8)', 'rgba(59,130,246,0.8)', 'rgba(20,184,166,0.8)', 'rgba(251,191,36,0.8)', 'rgba(248,113,113,0.8)', 'rgba(52,211,153,0.8)']
  const labels = Object.keys(freq)

  const data = {
    labels,
    datasets: [{
      data: labels.map((l) => freq[l]),
      backgroundColor: labels.map((_, i) => COLORS[i % COLORS.length]),
      borderWidth: 2,
      borderColor: labels.map((_, i) => COLORS[i % COLORS.length].replace('0.8', '1')),
      hoverOffset: 6,
    }],
  }

  return (
    <div className="h-52">
      <Doughnut data={data} options={{ ...BASE_OPTIONS, cutout: '50%' }} />
    </div>
  )
}
