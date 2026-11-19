import { useMemo, useState } from 'react'
import { Eye, FileClock, FileText } from 'lucide-react'
import type { Order, UploadRecord } from './types'

const fmtDate = (value: string) => new Date(value).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
function Badge({ status }: { status: string }) {
  const value = status.toLowerCase()
  const tone = value.includes('bound') || value.includes('ready') || value.includes('added') ? 'green' : value.includes('flagged') ? 'red' : value.includes('review') ? 'amber' : 'blue'
  return <span className={`status-badge ${tone}`}><span />{status}</span>
}

export function History({ orders, uploads, search, onViewOrder, onViewUpload }: { orders: Order[]; uploads: UploadRecord[]; search: string; onViewOrder: (order: Order) => void; onViewUpload: (upload: UploadRecord) => void }) {
  const [tab, setTab] = useState<'orders' | 'uploads'>('orders')
  const needle = search.trim().toLowerCase()
  const filteredOrders = useMemo(() => orders.filter((order) => !needle || Object.values(order).some((value) => String(value).toLowerCase().includes(needle))), [orders, needle])
  const filteredUploads = useMemo(() => uploads.filter((upload) => !needle || [upload.name, upload.kind, upload.status, upload.uploadedAt].some((value) => value.toLowerCase().includes(needle))), [uploads, needle])

  return <div className="history-page">
    <header className="history-heading history-heading-simple">
      <div><h1>History</h1></div>
      <div className="history-simple-meta"><span className="table-live-dot" /> {orders.length + uploads.length} TOTAL</div>
    </header>

    <section className="history-records-card history-table-only">
      <div className="history-records-header">
        <div><h2>{tab === 'orders' ? 'Order history' : 'Upload records'}</h2></div>
        <div className="records-controls"><button className={`record-tab ${tab === 'orders' ? 'selected' : ''}`} onClick={() => setTab('orders')}>Orders <span>{orders.length}</span></button><button className={`record-tab ${tab === 'uploads' ? 'selected' : ''}`} onClick={() => setTab('uploads')}>Uploads <span>{uploads.length}</span></button></div>
      </div>
      {tab === 'orders' ? <div className="table-overflow"><table className="history-table"><thead><tr><th>REFERENCE / ACCOUNT</th><th>LINE OF BUSINESS</th><th>SUBMITTED</th><th>PREMIUM</th><th>STATUS</th><th className="row-action-header" /></tr></thead><tbody>
        {filteredOrders.map((order) => <tr key={order.id}><td><strong>{order.id}</strong><span>{order.customerName}</span></td><td>{order.policyType}</td><td>{fmtDate(order.uploadedAt)}</td><td className="history-premium">{order.premium}</td><td><Badge status={order.status} /></td><td className="row-more"><button className="history-open" onClick={() => onViewOrder(order)} aria-label={`View ${order.id}`} title="View"><Eye size={15} /></button></td></tr>)}
        {!filteredOrders.length && <tr><td colSpan={6} className="history-empty">No orders match this search.</td></tr>}
      </tbody></table></div> : <div className="table-overflow"><table className="history-table"><thead><tr><th>DOCUMENT</th><th>FILE TYPE</th><th>UPLOADED</th><th>FILE SIZE</th><th>STATUS</th><th className="row-action-header" /></tr></thead><tbody>
        {filteredUploads.map((upload) => <tr key={upload.id}><td><div className="history-doc-name"><span><FileText size={14} /></span><strong>{upload.name}</strong></div></td><td>{upload.kind}</td><td>{fmtDate(upload.uploadedAt)}</td><td>{upload.size ? `${(upload.size / (1024 * 1024)).toFixed(1)} MB` : '—'}</td><td><Badge status={upload.status} /></td><td className="row-more"><button className="history-open" onClick={() => onViewUpload(upload)} aria-label={`View ${upload.name}`} title="View"><Eye size={15} /></button></td></tr>)}
        {!filteredUploads.length && <tr><td colSpan={6} className="history-empty">No upload records match this search.</td></tr>}
      </tbody></table></div>}
      <footer className="records-footer"><span><FileClock size={14} /> {tab === 'orders' ? `${filteredOrders.length} order records` : `${filteredUploads.length} upload records`} · times shown in your local timezone</span><span><span className="table-live-dot" /> Saved in this demo workspace</span></footer>
    </section>
  </div>
}
