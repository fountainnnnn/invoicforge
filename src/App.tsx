import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import CreateInvoice from './pages/CreateInvoice'
import InvoiceView from './pages/InvoiceView'
import Clients from './pages/Clients'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create" element={<CreateInvoice />} />
      <Route path="/invoice/:id" element={<InvoiceView />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}
