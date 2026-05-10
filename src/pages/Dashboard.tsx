import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileText, Plus, AlertTriangle, TrendingUp, Clock, DollarSign, ChevronRight, RefreshCw } from 'lucide-react'
import { api, Invoice } from '../lib/api'

export default function Dashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const load = async () => {
    try {
      setLoading(true); setError('')
      const data = await api.invoices.list()
      setInvoices(data)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const markPaid = async (id: string) => {
    try {
      await api.invoices.updateStatus(id, 'paid')
      setSuccess(`Invoice ${id} marked as paid`)
      load()
      setTimeout(() => setSuccess(''), 3000)
    } catch (e: any) { setError(e.message) }
  }

  const deleteInv = async (id: string) => {
    if (!confirm('Delete this invoice?')) return
    try {
      await api.invoices.delete(id)
      setSuccess('Invoice deleted')
      load()
      setTimeout(() => setSuccess(''), 3000)
    } catch (e: any) { setError(e.message) }
  }

  const totalOutstanding = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.total, 0)
  const totalCollected = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0)
  const overdueCount = invoices.filter(i => i.status === 'overdue').length

  const statusBadge = (s: string) => {
    const map: Record<string, string> = { paid: 'badge-paid', pending: 'badge-pending', overdue: 'badge-overdue', draft: 'badge-draft', sent: 'badge-pending' }
    return map[s] || 'badge-draft'
  }

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="flex items-center gap-3 text-muted"><RefreshCw size={20} className="animate-spin" /> Loading dashboard...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream">
      <nav className="border-b border-stone/20 bg-white/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center"><FileText size={16} className="text-white" /></div>
            <span className="font-display text-xl font-semibold">InvoiceForge</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-sm text-ink font-medium">Dashboard</Link>
            <Link to="/clients" className="btn-ghost text-sm">Clients</Link>
            <Link to="/create" className="btn-primary text-sm"><Plus size={15} /> New Invoice</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Alerts */}
        {error && <div className="card-flat p-4 mb-6 bg-red-50 border-red-200 text-red-700 text-sm flex items-center gap-2"><AlertTriangle size={16} /> {error}<button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">Close</button></div>}
        {success && <div className="card-flat p-4 mb-6 bg-green-50 border-green-200 text-green-700 text-sm flex items-center gap-2"><TrendingUp size={16} /> {success}</div>}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-5"><div className="text-xs text-muted font-mono mb-1 uppercase tracking-wider">Outstanding</div><div className="text-2xl font-display font-bold">${totalOutstanding.toFixed(2)}</div></div>
          <div className="card p-5"><div className="text-xs text-muted font-mono mb-1 uppercase tracking-wider">Collected</div><div className="text-2xl font-display font-bold text-leaf">${totalCollected.toFixed(2)}</div></div>
          <div className="card p-5"><div className="text-xs text-muted font-mono mb-1 uppercase tracking-wider">Total Invoices</div><div className="text-2xl font-display font-bold">{invoices.length}</div></div>
          <div className="card p-5"><div className="text-xs text-muted font-mono mb-1 uppercase tracking-wider">Overdue</div><div className="text-2xl font-display font-bold text-red-500">{overdueCount}</div></div>
        </div>

        {/* Overdue alert */}
        {overdueCount > 0 && (
          <div className="card-flat p-4 mb-6 bg-amber-50 border-amber-200 flex items-center gap-2 text-sm text-amber-800">
            <Clock size={16} /> {overdueCount} invoice{overdueCount > 1 ? 's' : ''} overdue. <Link to="/dashboard" className="underline font-medium">Review now</Link>
          </div>
        )}

        {/* Invoice List */}
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-stone/20 flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg">Invoices</h2>
            <div className="flex gap-2">
              <button onClick={load} className="btn-ghost text-sm"><RefreshCw size={14} /> Refresh</button>
              <Link to="/create" className="btn-primary text-sm"><Plus size={14} /> New</Link>
            </div>
          </div>

          {invoices.length === 0 ? (
            <div className="p-16 text-center">
              <FileText size={40} className="text-stone-300 mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-ink/60 mb-2">No invoices yet</h3>
              <p className="text-muted text-sm mb-6">Create your first invoice and start getting paid.</p>
              <Link to="/create" className="btn-primary"><Plus size={15} /> Create Your First Invoice</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone/20">
                    {['Invoice', 'Client', 'Amount', 'Status', 'Date', ''].map(h => (
                      <th key={h} className="text-left p-4 text-xs font-mono text-muted uppercase tracking-wider font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id} className="border-b border-stone/10 last:border-0 hover:bg-warm/40 transition-colors cursor-pointer" onClick={() => navigate(`/invoice/${inv.id}`)}>
                      <td className="p-4 font-mono text-sm">{inv.id}</td>
                      <td className="p-4 text-sm font-medium">{inv.client_name}</td>
                      <td className="p-4 font-semibold">${inv.total.toFixed(2)}</td>
                      <td className="p-4"><span className={`badge ${statusBadge(inv.status)}`}>{inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}</span></td>
                      <td className="p-4 text-sm text-muted">{inv.created_at?.slice(0, 10)}</td>
                      <td className="p-4">
                        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                          {inv.status !== 'paid' && (
                            <button onClick={() => markPaid(inv.id)} className="btn-ghost text-xs py-1 px-2 text-green-600">Paid</button>
                          )}
                          <button onClick={() => deleteInv(inv.id)} className="btn-ghost text-xs py-1 px-2 text-red-500">Delete</button>
                          <ChevronRight size={16} className="text-muted" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
