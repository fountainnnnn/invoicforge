const BASE = 'http://127.0.0.1:5920/api'

export interface Client { id: string; name: string; email: string; company?: string; phone?: string; created_at: string }
export interface InvoiceItem { desc: string; qty: number; rate: number }
export interface Invoice { id: string; client_name: string; client_email: string; items: InvoiceItem[]; subtotal: number; tax: number; total: number; status: string; due_date?: string; notes?: string; created_at: string; paid_at?: string }

async function req(path: string, opts?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  })
  if (!res.ok) throw new Error(await res.text().catch(() => 'Request failed'))
  return res.json()
}

export const api = {
  clients: {
    list: () => req('/clients'),
    create: (data: Partial<Client>) => req('/clients', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => req(`/clients/${id}`, { method: 'DELETE' }),
  },
  invoices: {
    list: () => req('/invoices'),
    get: (id: string) => req(`/invoices/${id}`),
    create: (data: any) => req('/invoices', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) => req(`/invoices/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    delete: (id: string) => req(`/invoices/${id}`, { method: 'DELETE' }),
  }
}
