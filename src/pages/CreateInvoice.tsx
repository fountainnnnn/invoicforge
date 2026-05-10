import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FileText, Plus, Trash2, Send, ArrowLeft, AlertTriangle, RefreshCw } from 'lucide-react'
import { api, Client } from '../lib/api'

interface LineItem { desc: string; qty: number; rate: number }

export default function CreateInvoice() {
  const navigate = useNavigate()
  const [clients, setClients] = useState<Client[]>([])
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [items, setItems] = useState<LineItem[]>([{ desc: '', qty: 1, rate: 0 }])
  const [taxRate, setTaxRate] = useState(9)
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.clients.list().then(setClients).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const addItem = () => setItems([...items, { desc: '', qty: 1, rate: 0 }])
  const removeItem = (i: number) => items.length > 1 && setItems(items.filter((_, j) => j !== i))
  const updateItem = (i: number, f: keyof LineItem, v: string | number) => {
    const n = [...items]; (n[i] as any)[f] = v; setItems(n)
  }

  const subtotal = items.reduce((s, i) => s + (i.qty || 0) * (i.rate || 0), 0)
  const tax = subtotal * (taxRate / 100)
  const total = subtotal + tax

  const selectClient = (c: Client) => {
    setClientName(c.name); setClientEmail(c.email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientName || !clientEmail) { setError('Client name and email required'); return }
    if (items.some(i => !i.desc)) { setError('All line items need a description'); return }

    setSubmitting(true); setError('')
    try {
      const result = await api.invoices.create({ client_name: clientName, client_email: clientEmail, items, tax_rate: taxRate, due_date: dueDate, notes })
      navigate(`/invoice/${result.id}`)
    } catch (e: any) { setError(e.message) }
    finally { setSubmitting(false) }
  }

  return (
    <div className="min-h-screen bg-cream">
      <nav className="border-b border-stone/20 bg-white/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center"><FileText size={16} className="text-white" /></div>
            <span className="font-display text-xl font-semibold">InvoiceForge</span>
          </Link>
          <Link to="/dashboard" className="text-sm text-muted hover:text-ink flex items-center gap-1"><ArrowLeft size={14} /> Back to Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="font-display text-3xl font-bold mb-8">Create Invoice</h1>

        {error && <div className="card-flat p-4 mb-6 bg-red-50 border-red-200 text-red-700 text-sm flex items-center gap-2"><AlertTriangle size={16} /> {error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Client Selection */}
          <div className="card p-6 mb-6">
            <h2 className="font-display font-semibold text-lg mb-5">Client</h2>
            {clients.length > 0 && (
              <div className="mb-4">
                <label className="label">Select existing client</label>
                <select className="input" onChange={e => { const c = clients.find(c => c.id === e.target.value); if (c) selectClient(c) }}>
                  <option value="">Choose a client...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name} — {c.email}</option>)}
                </select>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="label">Client Name *</label><input className="input" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Acme Corp" required /></div>
              <div><label className="label">Client Email *</label><input className="input" type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="billing@acme.com" required /></div>
            </div>
          </div>

          {/* Line Items */}
          <div className="card p-6 mb-6">
            <h2 className="font-display font-semibold text-lg mb-5">Line Items</h2>
            {items.map((item, i) => (
              <div key={i} className="flex items-end gap-3 mb-4 pb-4 border-b border-stone/20 last:border-0">
                <div className="flex-1"><label className="label">Description</label><input className="input" value={item.desc} onChange={e => updateItem(i, 'desc', e.target.value)} placeholder="Service or product" /></div>
                <div className="w-20"><label className="label">Qty</label><input className="input" type="number" min={1} value={item.qty} onChange={e => updateItem(i, 'qty', parseInt(e.target.value) || 1)} /></div>
                <div className="w-24"><label className="label">Rate ($)</label><input className="input" type="number" min={0} step={0.01} value={item.rate} onChange={e => updateItem(i, 'rate', parseFloat(e.target.value) || 0)} /></div>
                <div className="w-24 pt-6 text-right font-medium text-sm">${(item.qty * item.rate).toFixed(2)}</div>
                <button type="button" onClick={() => removeItem(i)} className="pb-1 text-muted hover:text-red-500"><Trash2 size={16} /></button>
              </div>
            ))}
            <button type="button" onClick={addItem} className="btn-outline text-sm mt-2"><Plus size={14} /> Add Item</button>
          </div>

          {/* Details */}
          <div className="card p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="label">Tax Rate (%)</label><input className="input" type="number" value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} /></div>
              <div><label className="label">Due Date</label><input className="input" type="text" value={dueDate} onChange={e => setDueDate(e.target.value)} placeholder="e.g. Net 30" /></div>
              <div className="md:col-span-2"><label className="label">Notes</label><textarea className="input min-h-[80px]" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Payment instructions, thank you notes..." /></div>
            </div>
          </div>

          {/* Summary */}
          <div className="card p-6 mb-6">
            <div className="max-w-xs ml-auto space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted">Tax ({taxRate}%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-display text-xl font-bold pt-2 border-t border-stone/30"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center text-base py-3">
            {submitting ? <><RefreshCw size={16} className="animate-spin" /> Creating...</> : <><Send size={16} /> Create & Send Invoice</>}
          </button>
        </form>
      </div>
    </div>
  )
}
