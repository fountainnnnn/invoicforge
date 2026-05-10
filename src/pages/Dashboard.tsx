import { Link } from 'react-router-dom'
import { FileText, Plus, TrendingUp } from 'lucide-react'

const invoices = [
  { id: 'INV-001', client: 'Brightside Design', amount: 2400, status: 'overdue', date: 'Apr 26' },
  { id: 'INV-002', client: 'Meridian Software', amount: 5800, status: 'pending', date: 'May 10' },
  { id: 'INV-003', client: 'Riverside Studio', amount: 800, status: 'paid', date: 'May 5' },
  { id: 'INV-004', client: 'Atlas Creative', amount: 1200, status: 'paid', date: 'Apr 15' },
  { id: 'INV-005', client: 'Northpoint Consulting', amount: 3600, status: 'overdue', date: 'Apr 10' },
]

const sColors: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  overdue: 'bg-red-100 text-red-700',
}

export default function Dashboard() {
  const totalOutstanding = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.amount, 0)
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)

  return (
    <div className="min-h-screen bg-cream">
      <nav className="border-b border-stone/30 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
              <FileText size={16} className="text-white" />
            </div>
            <span className="font-display text-xl font-semibold text-ink">InvoiceForge</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-muted hover:text-ink">Home</Link>
            <Link to="/create" className="btn-primary text-sm"><Plus size={15} /> New Invoice</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-5">
            <div className="text-xs text-muted font-mono mb-1 uppercase tracking-wider">Outstanding</div>
            <div className="text-2xl font-display font-bold text-ink">${totalOutstanding.toLocaleString()}</div>
          </div>
          <div className="card p-5">
            <div className="text-xs text-muted font-mono mb-1 uppercase tracking-wider">Collected</div>
            <div className="text-2xl font-display font-bold text-leaf">${totalPaid.toLocaleString()}</div>
          </div>
          <div className="card p-5">
            <div className="text-xs text-muted font-mono mb-1 uppercase tracking-wider">Invoices</div>
            <div className="text-2xl font-display font-bold text-ink">{invoices.length}</div>
          </div>
          <div className="card p-5">
            <div className="text-xs text-muted font-mono mb-1 uppercase tracking-wider">Overdue</div>
            <div className="text-2xl font-display font-bold text-ink">{invoices.filter(i => i.status === 'overdue').length}</div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="p-5 border-b border-stone/30 flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg text-ink">Recent Invoices</h2>
            <Link to="/create" className="btn-primary text-sm"><Plus size={14} /> New</Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone/20">
                {['Invoice', 'Client', 'Amount', 'Date', 'Status', ''].map(h => (
                  <th key={h} className="text-left p-4 text-xs font-mono text-muted uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="border-b border-stone/20 last:border-0 hover:bg-warm/50 transition-colors">
                  <td className="p-4 font-mono text-sm">{inv.id}</td>
                  <td className="p-4 text-sm">{inv.client}</td>
                  <td className="p-4 font-semibold">${inv.amount.toLocaleString()}</td>
                  <td className="p-4 text-sm text-muted">{inv.date}</td>
                  <td className="p-4"><span className={`badge ${sColors[inv.status]}`}>{inv.status}</span></td>
                  <td className="p-4"><button className="text-muted hover:text-ink text-sm">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Link to="/create" className="card p-6 mt-6 flex items-center gap-4 hover:bg-warm/50 transition-colors group">
          <TrendingUp size={22} className="text-gold group-hover:scale-110 transition-transform" />
          <div>
            <div className="font-display font-semibold text-ink">Create New Invoice</div>
            <div className="text-sm text-muted">Get paid faster. Send a professional invoice in 30 seconds.</div>
          </div>
        </Link>
      </div>
    </div>
  )
}
