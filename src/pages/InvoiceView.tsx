import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FileText, ArrowLeft, Download, CheckCircle, Trash2, AlertTriangle, RefreshCw } from 'lucide-react'
import { api, Invoice } from '../lib/api'

export default function InvoiceView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    if (!id) return
    api.invoices.get(id).then(setInvoice).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [id])

  const markPaid = async () => {
    if (!id) return
    try {
      await api.invoices.updateStatus(id, 'paid')
      setPaid(true)
      setInvoice({ ...invoice!, status: 'paid', paid_at: new Date().toISOString() })
    } catch (e: any) { setError(e.message) }
  }

  const del = async () => {
    if (!id || !confirm('Delete this invoice?')) return
    await api.invoices.delete(id)
    navigate('/dashboard')
  }

  if (loading) return <div className="min-h-screen bg-cream flex items-center justify-center"><RefreshCw size={20} className="animate-spin text-muted" /></div>
  if (error) return <div className="min-h-screen bg-cream flex items-center justify-center text-red-500">{error}</div>
  if (!invoice) return <div className="min-h-screen bg-cream flex items-center justify-center text-muted">Invoice not found</div>

  const statusBadge = (s: string) => {
    const map: Record<string, string> = { paid: 'badge-paid', sent: 'badge-pending', draft: 'badge-draft' }
    return map[s] || 'badge-draft'
  }

  return (
    <div className="min-h-screen bg-cream">
      <nav className="border-b border-stone/20 bg-white/70 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center"><FileText size={16} className="text-white" /></div>
            <span className="font-display text-xl font-semibold">InvoiceForge</span>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/dashboard')} className="btn-ghost text-sm"><ArrowLeft size={14} /> Back</button>
            {invoice.status !== 'paid' && <button onClick={markPaid} className="btn-primary text-sm"><CheckCircle size={15} /> Mark Paid</button>}
            <button onClick={del} className="btn-danger text-sm"><Trash2 size={14} /> Delete</button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="card-flat p-8 md:p-12">
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="font-display text-2xl font-bold mb-1">{invoice.id}</h1>
              <span className={`badge ${statusBadge(invoice.status)} mt-2`}>{invoice.status.toUpperCase()}</span>
            </div>
            <div className="text-right">
              {invoice.paid_at && <div className="text-sm text-leaf font-medium">Paid on {new Date(invoice.paid_at).toLocaleDateString()}</div>}
            </div>
          </div>

          {/* Client */}
          <div className="mb-10">
            <div className="text-sm text-muted mb-1">Bill To:</div>
            <div className="font-semibold">{invoice.client_name}</div>
            <div className="text-sm text-muted">{invoice.client_email}</div>
          </div>

          {/* Items */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b border-stone/30">
                <th className="text-left py-3 text-xs font-mono text-muted uppercase tracking-wider">Description</th>
                <th className="text-right py-3 text-xs font-mono text-muted uppercase tracking-wider">Qty</th>
                <th className="text-right py-3 text-xs font-mono text-muted uppercase tracking-wider">Rate</th>
                <th className="text-right py-3 text-xs font-mono text-muted uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i} className="border-b border-stone/10">
                  <td className="py-3">{item.desc}</td>
                  <td className="py-3 text-right">{item.qty}</td>
                  <td className="py-3 text-right">${item.rate.toFixed(2)}</td>
                  <td className="py-3 text-right font-medium">${(item.qty * item.rate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="max-w-xs ml-auto space-y-2 mb-8">
            <div className="flex justify-between text-sm"><span className="text-muted">Subtotal</span><span>${invoice.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted">Tax</span><span>${invoice.tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-display text-xl font-bold pt-2 border-t border-stone/30">
              <span>Total</span><span>${invoice.total.toFixed(2)}</span>
            </div>
          </div>

          {invoice.notes && (
            <div className="border-t border-stone/20 pt-6">
              <div className="text-sm text-muted mb-1">Notes:</div>
              <div className="text-sm">{invoice.notes}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
