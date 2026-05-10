import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Plus, Trash2, RefreshCw, Users, AlertTriangle } from 'lucide-react'
import { api, Client } from '../lib/api'

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '' })

  const load = async () => {
    try { setLoading(true); setClients(await api.clients.list()) }
    catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) { setError('Name and email required'); return }
    try {
      await api.clients.create(form)
      setShowForm(false); setForm({ name: '', email: '', company: '', phone: '' })
      load()
    } catch (e: any) { setError(e.message) }
  }

  const del = async (id: string) => {
    if (!confirm('Delete client?')) return
    await api.clients.delete(id)
    load()
  }

  return (
    <div className="min-h-screen bg-cream">
      <nav className="border-b border-stone/20 bg-white/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center"><FileText size={16} className="text-white" /></div>
            <span className="font-display text-xl font-semibold">InvoiceForge</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="btn-ghost text-sm">Dashboard</Link>
            <button onClick={() => setShowForm(true)} className="btn-primary text-sm"><Plus size={15} /> Add Client</button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {error && <div className="card-flat p-4 mb-6 bg-red-50 border-red-200 text-red-700 text-sm flex items-center gap-2"><AlertTriangle size={16} /> {error}<button onClick={() => setError('')} className="ml-auto text-red-400">Close</button></div>}

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold">Clients</h1>
          <button onClick={load} className="btn-ghost text-sm"><RefreshCw size={14} /> Refresh</button>
        </div>

        {showForm && (
          <form onSubmit={create} className="card p-6 mb-6">
            <h2 className="font-display font-semibold text-lg mb-4">New Client</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="label">Name *</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div><label className="label">Email *</label><input className="input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              <div><label className="label">Company</label><input className="input" value={form.company} onChange={e => setForm({...form, company: e.target.value})} /></div>
              <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
            </div>
            <div className="flex gap-3 mt-5"><button type="submit" className="btn-primary">Save Client</button><button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button></div>
          </form>
        )}

        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-muted flex items-center justify-center gap-2"><RefreshCw size={16} className="animate-spin" /> Loading...</div>
          ) : clients.length === 0 ? (
            <div className="p-16 text-center">
              <Users size={40} className="text-stone-300 mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-ink/60 mb-2">No clients yet</h3>
              <p className="text-muted text-sm mb-6">Add your first client to get started.</p>
              <button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={15} /> Add Client</button>
            </div>
          ) : (
            <table className="w-full">
              <thead><tr className="border-b border-stone/20">{['Name','Email','Company','',''].map(h => <th key={h} className="text-left p-4 text-xs font-mono text-muted uppercase tracking-wider">{h}</th>)}</tr></thead>
              <tbody>{clients.map(c => (
                <tr key={c.id} className="border-b border-stone/10 hover:bg-warm/40 transition-colors">
                  <td className="p-4 font-medium">{c.name}</td>
                  <td className="p-4 text-sm text-muted">{c.email}</td>
                  <td className="p-4 text-sm">{c.company || '—'}</td>
                  <td className="p-4 text-right"><button onClick={() => del(c.id)} className="btn-ghost text-xs text-red-500 py-1">Delete</button></td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
