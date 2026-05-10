import { Link } from 'react-router-dom'
import { FileText, Send, CheckCircle, DollarSign, TrendingUp, Clock } from 'lucide-react'

const steps = [
  { icon: FileText, title: 'Create Invoice', desc: 'Pick a template, add your client and line items. Takes 30 seconds.' },
  { icon: Send, title: 'Send & Track', desc: 'Email a professional PDF invoice. Know when they open it.' },
  { icon: CheckCircle, title: 'Get Paid', desc: 'Mark as paid, track what\'s due, export for tax season.' },
]

const features = [
  { icon: DollarSign, title: 'Multi-Currency', desc: 'Invoice in 40+ currencies with automatic conversion.' },
  { icon: TrendingUp, title: 'Payment Tracking', desc: 'See which invoices are paid, pending, or overdue at a glance.' },
  { icon: Clock, title: 'Payment Reminders', desc: 'Automatic follow-up emails for overdue invoices.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="border-b border-stone/30 bg-white/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
              <FileText size={16} className="text-white" />
            </div>
            <span className="font-display text-xl font-semibold text-ink">InvoiceForge</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-sm text-muted hover:text-ink transition-colors">Dashboard</Link>
            <Link to="/create" className="btn-primary text-sm">Create Invoice</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <div className="max-w-2xl">
          <div className="badge bg-gold/15 text-gold border border-gold/20 mb-6">Simple Invoicing for Freelancers</div>
          <h1 className="font-display text-5xl lg:text-6xl font-bold text-ink leading-tight mb-6">
            Create invoices in seconds.{' '}
            <span className="text-gold">Get paid faster.</span>
          </h1>
          <p className="text-lg text-muted mb-8 max-w-lg leading-relaxed">
            No subscriptions. No bloated features. Just a clean invoice generator that does one thing well. Create, send, and get paid.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/create" className="btn-primary text-base px-8 py-3">Create Your First Invoice</Link>
            <Link to="/dashboard" className="btn-outline text-base px-8 py-3">View Dashboard</Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-warm py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-center text-ink mb-4">How it works</h2>
          <p className="text-muted text-center mb-14 max-w-md mx-auto">Three simple steps to get paid professionally.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="card p-8 text-center">
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-5">
                  <s.icon size={26} className="text-gold" />
                </div>
                <h3 className="font-display text-xl font-semibold text-ink mb-3">{s.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-center text-ink mb-4">Everything you need, nothing you don't</h2>
          <p className="text-muted text-center mb-14 max-w-md mx-auto">Built for freelancers who just want to send invoices and get back to work.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="card p-8 flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <f.icon size={22} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">{f.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-warm py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="card max-w-lg mx-auto p-10 text-center">
            <h2 className="font-display text-3xl font-bold text-ink mb-2">Free to start</h2>
            <p className="text-muted mb-8">5 free invoices per month. No credit card needed.</p>
            <div className="text-5xl font-display font-bold text-ink mb-2">$9<span className="text-2xl text-muted font-sans">/mo</span></div>
            <p className="text-sm text-muted mb-8">Unlimited invoices, clients, and exports.</p>
            <Link to="/create" className="btn-primary w-full justify-center text-base py-3">Start Free</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone/30 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-muted">
          <span>InvoiceForge — Simple invoicing for freelancers.</span>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="hover:text-ink transition-colors">Dashboard</Link>
            <Link to="/create" className="hover:text-ink transition-colors">Create</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
