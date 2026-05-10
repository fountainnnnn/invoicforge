import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Save } from 'lucide-react'

export default function Settings() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ bizName: '', bizEmail: '', bizAddress: '', defaultTax: '9', currency: 'USD', paymentTerms: 'Net 30' })

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('invoicforge_settings', JSON.stringify(form))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-cream">
      <nav className="border-b border-stone/20 bg-white/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center"><FileText size={16} className="text-white" /></div>
            <span className="font-display text-xl font-semibold">InvoiceForge</span>
          </Link>
          <Link to="/dashboard" className="btn-ghost text-sm">Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="font-display text-2xl font-bold mb-6">Settings</h1>
        <form onSubmit={save} className="card p-6">
          {saved && <div className="p-3 mb-5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">Settings saved.</div>}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div><label className="label">Business Name</label><input className="input" value={form.bizName} onChange={e => setForm({...form, bizName: e.target.value})} /></div>
            <div><label className="label">Business Email</label><input className="input" type="email" value={form.bizEmail} onChange={e => setForm({...form, bizEmail: e.target.value})} /></div>
            <div className="md:col-span-2"><label className="label">Address</label><textarea className="input min-h-[60px]" value={form.bizAddress} onChange={e => setForm({...form, bizAddress: e.target.value})} /></div>
            <div><label className="label">Default Tax (%)</label><input className="input" type="number" value={form.defaultTax} onChange={e => setForm({...form, defaultTax: e.target.value})} /></div>
            <div><label className="label">Currency</label><select className="input" value={form.currency} onChange={e => setForm({...form, currency: e.target.value})}><option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="SGD">SGD</option><option value="MYR">MYR</option></select></div>
            <div><label className="label">Payment Terms</label><select className="input" value={form.paymentTerms} onChange={e => setForm({...form, paymentTerms: e.target.value})}><option value="Net 15">Net 15</option><option value="Net 30">Net 30</option><option value="Net 60">Net 60</option><option value="Due on receipt">Due on receipt</option></select></div>
          </div>
          <button type="submit" className="btn-primary"><Save size={15} /> Save Settings</button>
        </form>
      </div>
    </div>
  )
}
