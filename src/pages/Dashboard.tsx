import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Plus } from 'lucide-react'

interface Invoice { id: string; client: string; amount: number; status: string; date: string }

const sColors: Record<string, string> = { paid: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-700', overdue: 'bg-red-100 text-red-700' }

export default function Dashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('invoicforge_invoices')
    if (saved) setInvoices(JSON.parse(saved))
  }, [])

  const totalOutstanding = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.amount, 0)
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)

  return (
    <div className="min-h-screen bg-cream">
      <nav className="border-b border-stone/30 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center"><FileText size={16} className="text-white" /></div>
            <span className="font-display text-xl font-semibold text-ink">InvoiceForge</span>
          </div>
          <Link to="/create" className="btn-primary text-sm"><Plus size={15} /> New Invoice</Link>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-5"><div className="text-xs text-muted font-mono mb-1 uppercase tracking-wider">Outstanding</div><div className="text-2xl font-display font-bold text-ink">${totalOutstanding.toLocaleString()}</div></div>
          <div className="card p-5"><div className="text-xs text-muted font-mono mb-1 uppercase tracking-wider">Collected</div><div className="text-2xl font-display font-bold text-leaf">${totalPaid.toLocaleString()}</div></div>
          <div className="card p-5"><div className="text-xs text-muted font-mono mb-1 uppercase tracking-wider">Invoices</div><div className="text-2xl font-display font-bold text-ink">{invoices.length}</div></div>
          <div className="card p-5"><div className="text-xs text-muted font-mono mb-1 uppercase tracking-wider">Overdue</div><div className="text-2xl font-display font-bold text-ink">{invoices.filter(i => i.status === 'overdue').length}</div></div>
        </div>
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-stone/30 flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg text-ink">Invoices</h2>
            <Link to="/create" className="btn-primary text-sm"><Plus size={14} /> New</Link>
          </div>
          {invoices.length === 0 ? (
            <div className="p-12 text-center text-muted text-sm">No invoices yet. <Link to="/create" className="text-gold underline">Create your first one.</Link></div>
          ) : (
            <table className="w-full">
              <thead><tr className="border-b border-stone/20">{['Invoice','Client','Amount','Status',''].map(h => <th key={h} className="text-left p-4 text-xs font-mono text-muted uppercase tracking-wider">{h}</th>)}</tr></thead>
              <tbody>{invoices.map(inv => (
                <tr key={inv.id} className="border-b border-stone/20 hover:bg-warm/50"><td className="p-4 font-mono text-sm">{inv.id}</td><td className="p-4 text-sm">{inv.client}</td><td className="p-4 font-semibold">${inv.amount.toLocaleString()}</td><td className="p-4"><span className={`badge ${sColors[inv.status]}`}>{inv.status}</span></td><td className="p-4"><button className="text-muted hover:text-ink text-sm">View</button></td></tr>))}</tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
