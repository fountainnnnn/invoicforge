import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { FileText, Send, CheckCircle, TrendingUp, Clock, DollarSign, Shield } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const features = [
  { icon: FileText, title: 'Professional Invoices', desc: 'Create polished, branded invoices with payment links in under a minute.' },
  { icon: Send, title: 'Send & Track', desc: 'Email invoices directly. Know when clients view them.' },
  { icon: CheckCircle, title: 'Payment Tracking', desc: 'See paid, pending, and overdue invoices at a glance.' },
]

const stats = [
  { value: '73%', label: 'faster payment with automated invoicing' },
  { value: '5min', label: 'average time to create an invoice' },
  { value: '$9/mo', label: 'unlimited invoices, no hidden fees' },
]

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-title', { y: 80, opacity: 0, duration: 1.2, ease: 'power4.out' })
      gsap.from('.hero-sub', { y: 40, opacity: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' })
      gsap.from('.hero-cta', { y: 30, opacity: 0, duration: 0.6, delay: 0.6, ease: 'power2.out' })
      gsap.from('.hero-visual', { scale: 0.85, opacity: 0, duration: 1.4, delay: 0.3, ease: 'back.out(1.7)' })
      
      gsap.from('.stat-item', { y: 50, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out',
        scrollTrigger: { trigger: statsRef.current, start: 'top 85%' }
      })
      
      gsap.from('.feature-card', { y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: featuresRef.current, start: 'top 80%' }
      })
      
      // Parallax orbs
      gsap.to('.orb-1', { y: -40, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to('.orb-2', { y: 25, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.5 })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-cream overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb-1 absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-gold/8 to-transparent blur-[120px]" />
        <div className="orb-2 absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-gold/5 to-transparent blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 border-b border-stone/20 bg-white/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
              <FileText size={16} className="text-white" />
            </div>
            <span className="font-display text-xl font-semibold">InvoiceForge</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="btn-ghost text-sm">Dashboard</Link>
            <Link to="/create" className="btn-primary text-sm">Create Invoice</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative z-10 pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="badge bg-gold/15 text-gold border border-gold/20 mb-5">Simple Invoicing for Freelancers</div>
              <h1 className="hero-title font-display text-5xl lg:text-6xl font-bold leading-tight mb-5">
                Stop chasing invoices.{' '}
                <span className="text-gold">Get paid.</span>
              </h1>
              <p className="hero-sub text-lg text-muted leading-relaxed mb-8 max-w-lg">
                Create professional invoices in seconds, track payments, and get paid faster. No bloated features, no learning curve.
              </p>
              <div className="hero-cta flex items-center gap-4 flex-wrap">
                <Link to="/create" className="btn-primary text-base px-8 py-3">Create Your First Invoice</Link>
                <Link to="/dashboard" className="btn-outline text-base px-8 py-3">View Dashboard</Link>
              </div>
            </div>
            <div className="hero-visual">
              <div className="card-flat p-6 shadow-lg">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-xs text-muted">INV-001</span>
                  <span className="badge bg-amber-100 text-amber-700">Pending</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-stone/20">
                    <span className="text-sm text-muted">Client</span>
                    <span className="text-sm font-medium">Brightside Design Co.</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone/20">
                    <span className="text-sm text-muted">Amount</span>
                    <span className="text-lg font-display font-bold">$2,400.00</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-muted">Status</span>
                    <span className="text-sm font-medium text-amber-600">Payment pending — reminder sent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="relative z-10 py-16 bg-warm/60">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {stats.map((s, i) => (
              <div key={i} className="stat-item">
                <div className="text-3xl font-display font-bold text-gold mb-1">{s.value}</div>
                <div className="text-sm text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="relative z-10 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-center mb-4">Built for how freelancers work</h2>
          <p className="text-muted text-center mb-14 max-w-md mx-auto">Everything you need to get paid, nothing you don't.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="feature-card card p-8 text-center">
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-5">
                  <f.icon size={26} className="text-gold" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-warm/60">
        <div className="max-w-md mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-bold mb-3">Ready to get paid faster?</h2>
          <p className="text-muted mb-8">Create your first invoice in under a minute. No credit card required.</p>
          <Link to="/create" className="btn-primary text-base px-8 py-3">Create Free Invoice</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone/20 py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-muted">
          <span>InvoiceForge — Simple invoicing for freelancers.</span>
          <div className="flex gap-4">
            <Link to="/dashboard" className="hover:text-ink">Dashboard</Link>
            <Link to="/create" className="hover:text-ink">Create</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
