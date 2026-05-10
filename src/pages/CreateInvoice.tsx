import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Plus, Trash2, Send, ArrowLeft } from 'lucide-react'

interface LineItem { desc: string; qty: number; rate: number }

export default function CreateInvoice() {
  const [client, setClient] = useState('')
  const [email, setEmail] = useState('')
  const [items, setItems] = useState<LineItem[]>([{ desc: '', qty: 1, rate: 0 }])
  const [created, setCreated] = useState(false)

  const addItem = () => setItems([...items, { desc: '', qty: 1, rate: 0 }])
  const removeItem = (i: number) => items.length > 1 && setItems(items.filter((_, j) => j !== i))
  const updateItem = (i: number, field: keyof LineItem, val: string | number) => {
    const newItems = [...items]; (newItems[i] as any)[field] = val; setItems(newItems)
  }

  const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0)
  const tax = subtotal * 0.09
  const total = subtotal + tax

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCreated(true)
  }

  if (created) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="card p-12 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-leaf/20 flex items-center justify-center mx-auto mb-6">
            <Send size={32} className="text-leaf" />
          </div>
          <h2 className="font-display text-2xl font-bold text-ink mb-3">Invoice Created!</h2>
          <p className="text-muted mb-8">Your invoice has been created and is ready to send to {client}.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/dashboard" className="btn-primary">View Dashboard</Link>
            <button className="btn-outline">Send Invoice</button>
          </div>
        </div>
      </div>
    )
  }

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
          <Link to="/" className="text-sm text-muted hover:text-ink flex items-center gap-1">
            <ArrowLeft size={14} /> Back
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="font-display text-3xl font-bold text-ink mb-8">Create Invoice</h1>

        <form onSubmit={handleSubmit}>
          <div className="card p-6 mb-6">
            <h2 className="font-display font-semibold text-lg text-ink mb-5">Client Details</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="label">Client Name</label>
                <input className="input" value={client} onChange={e => setClient(e.target.value)} placeholder="e.g. Acme Corp" required />
              </div>
              <div>
                <label className="label">Client Email</label>
                <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="billing@acme.com" required />
              </div>
            </div>
          </div>

          <div className="card p-6 mb-6">
            <h2 className="font-display font-semibold text-lg text-ink mb-5">Line Items</h2>
            {items.map((item, i) => (
              <div key={i} className="flex items-end gap-3 mb-4 pb-4 border-b border-stone/20 last:border-0">
                <div className="flex-1">
                  <label className="label">Description</label>
                  <input className="input" value={item.desc} onChange={e => updateItem(i, 'desc', e.target.value)} placeholder="Service or product" />
                </div>
                <div className="w-20">
                  <label className="label">Qty</label>
                  <input className="input" type="number" min={1} value={item.qty} onChange={e => updateItem(i, 'qty', parseInt(e.target.value) || 1)} />
                </div>
                <div className="w-24">
                  <label className="label">Rate</label>
                  <input className="input" type="number" min={0} step={0.01} value={item.rate} onChange={e => updateItem(i, 'rate', parseFloat(e.target.value) || 0)} />
                </div>
                <div className="w-20 pt-6 text-right font-medium text-sm">
                  ${(item.qty * item.rate).toLocaleString()}
                </div>
                <button type="button" onClick={() => removeItem(i)} className="pb-1 text-muted hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button type="button" onClick={addItem} className="btn-outline text-sm mt-2">
              <Plus size={14} /> Add Line Item
            </button>
          </div>

          <div className="card p-6 mb-6">
            <div className="max-w-xs ml-auto space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted">Tax (9%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-display text-xl font-bold pt-2 border-t border-stone/30">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full justify-center text-base py-3">
            <Send size={16} /> Create Invoice
          </button>
        </form>
      </div>
    </div>
  )
}
