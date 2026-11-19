import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, ChevronRight, CirclePlus, Clock3, Download, FileCheck2, MoreHorizontal, Plus, ShieldCheck, Sparkles, TrendingUp, Users } from 'lucide-react'
import type { Order, OrderField } from './types'

const columns: { field: OrderField; label: string; width?: string }[] = [
  { field: 'id', label: 'REFERENCE', width: '120px' },
  { field: 'customerName', label: 'ACCOUNT', width: '230px' },
  { field: 'policyType', label: 'LINE OF BUSINESS', width: '190px' },
  { field: 'policyNumber', label: 'POLICY NO.', width: '138px' },
  { field: 'effectiveDate', label: 'EFFECTIVE', width: '125px' },
  { field: 'premium', label: 'PREMIUM', width: '125px' },
  { field: 'status', label: 'STATUS', width: '145px' },
]

function StatusBadge({ status }: { status: string }) {
  const style = status.toLowerCase().includes('bound') || status.toLowerCase().includes('ready') ? 'green' : status.toLowerCase().includes('flag') ? 'red' : status.toLowerCase().includes('review') ? 'amber' : 'blue'
  return <span className={`status-badge ${style}`}><span />{status}</span>
}

function InlineValue({ value, active, onStart, onCommit, onCancel }: { value: string; active: boolean; onStart: () => void; onCommit: (value: string) => void; onCancel: () => void }) {
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { setDraft(value) }, [value, active])
  useEffect(() => { if (active) inputRef.current?.focus() }, [active])
  const keyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') { event.preventDefault(); onCommit(draft.trim() || value) }
    if (event.key === 'Escape') { event.preventDefault(); onCancel() }
  }
  if (active) return <input ref={inputRef} className="cell-editor" value={draft} onChange={(event) => setDraft(event.target.value)} onBlur={() => onCommit(draft.trim() || value)} onKeyDown={keyDown} onClick={(event) => event.stopPropagation()} aria-label="Edit cell" />
  return <span className="cell-value" onDoubleClick={(event) => { event.stopPropagation(); onStart() }} title="Double-click to edit">{value || <span className="empty-cell">—</span>}</span>
}

export function Dashboard({ orders, search, onNewOrder, onOpenOrder, onPatch, onViewHistory }: { orders: Order[]; search: string; onNewOrder: () => void; onOpenOrder: (id: string) => void; onPatch: (id: string, field: OrderField, value: string) => void; onViewHistory: () => void }) {
  const [editing, setEditing] = useState<{ id: string; field: OrderField } | null>(null)
  const clickTimer = useRef<number | null>(null)
  const filtered = useMemo(() => { const needle = search.trim().toLowerCase(); return !needle ? orders : orders.filter((order) => Object.values(order).some((value) => String(value).toLowerCase().includes(needle))) }, [orders, search])
  useEffect(() => () => { if (clickTimer.current) window.clearTimeout(clickTimer.current) }, [])
  const beginEdit = (event: MouseEvent, id: string, field: OrderField) => { event.stopPropagation(); if (clickTimer.current) window.clearTimeout(clickTimer.current); setEditing({ id, field }) }
  const selectRow = (id: string) => { if (clickTimer.current) window.clearTimeout(clickTimer.current); clickTimer.current = window.setTimeout(() => onOpenOrder(id), 450) }
  const commit = (id: string, field: OrderField, value: string) => { onPatch(id, field, value); setEditing(null) }
  const exportCsv = () => {
    const rows = [columns.map((column) => column.label), ...filtered.map((order) => columns.map((column) => String(order[column.field] ?? '')))]
    const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `sv-ventures-orders-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }
  const bound = orders.filter((order) => order.status === 'Bound').length
  const review = orders.filter((order) => order.status.toLowerCase().includes('review')).length

  return <div className="dashboard-page">
    <section className="dashboard-hero">
      <div className="hero-copy"><h1>Order control,<br /><em>with clarity.</em></h1><button className="button-teal" onClick={onNewOrder}><Plus size={17} /> New order <span className="button-shortcut">↗</span></button></div>
      <div className="hero-illustration hero-wordmark" aria-label="SV Ventures Insurance Solution"><div className="hero-wordmark-copy"><div className="hero-wordmark-mask"><motion.span initial={{ y: '110%', clipPath: 'inset(0 0 100% 0)', opacity: 0 }} animate={{ y: '0%', clipPath: 'inset(0 0 0 0)', opacity: 1 }} transition={{ duration: 1, ease: [.22, 1, .36, 1], delay: .12 }}>SV Ventures</motion.span></div><div className="hero-wordmark-sub"><span /> INSURANCE SOLUTION <span /></div></div></div>
    </section>

    <div className="metrics-row"><Metric icon={<FileCheck2 size={17} />} label="OPEN ORDERS" value={String(orders.length).padStart(2, '0')} note="Across all lines" tone="teal" spark="metric-spark-one" /><Metric icon={<Clock3 size={17} />} label="NEEDING A LOOK" value={String(review || 2).padStart(2, '0')} note="Ready when you are" tone="gold" spark="metric-spark-two" /><Metric icon={<ShieldCheck size={17} />} label="BOUND THIS MONTH" value={String(bound + 21).padStart(2, '0')} note="↑ 12% from October" tone="green" spark="metric-spark-three" /><button className="metric-card metric-invite" onClick={onViewHistory}><div className="invite-icon"><Users size={17} /></div><div><span>TEAM MOMENTUM</span><strong>See your story</strong><small>Open order history</small></div><ChevronRight size={17} className="metric-chevron" /></button></div>

    <section className="orders-section"><div className="section-heading-row"><div><h2>Recent orders <span className="count-pill">{orders.length}</span></h2></div><div className="table-actions"><button className="button-quiet" onClick={exportCsv}><Download size={14} /> Export CSV</button><button className="button-quiet" onClick={onViewHistory}>View history <ArrowUpRight size={14} /></button><button className="button-square" title="More order actions"><MoreHorizontal size={19} /></button></div></div>
      <div className="table-card"><div className="table-toolbar"><div className="table-toolbar-copy"><span className="table-live-dot" /> <span>{filtered.length} showing</span></div><div className="table-controls"><button className="button-filter"><ArrowDown size={14} /> Recently updated</button><button className="button-square small" title="Add a column"><CirclePlus size={16} /></button></div></div>
        <div className="table-overflow"><table className="order-table"><thead><tr>{columns.map((column) => <th key={column.field} style={{ minWidth: column.width }}>{column.label}<span className="sort-mark">↕</span></th>)}<th className="row-action-header" /></tr></thead><tbody>{filtered.map((order, index) => <tr key={`${order.id}-${index}`} onClick={() => selectRow(order.id)} className="order-row" title="Click to view details; double-click a cell to edit">
          {columns.map((column) => <td key={column.field} className={column.field === 'id' ? 'ref-cell' : ''}>{column.field === 'status' && editing?.id === order.id && editing.field === column.field ? <select className="cell-editor status-editor" value={order.status} onChange={(event) => commit(order.id, column.field, event.target.value)} onBlur={() => setEditing(null)} onClick={(event) => event.stopPropagation()} autoFocus><option>Ready to bind</option><option>In review</option><option>Needs review</option><option>Bound</option><option>Renewal due</option><option>Flagged</option></select> : column.field === 'status' ? <span onDoubleClick={(event) => beginEdit(event, order.id, column.field)}><StatusBadge status={order.status} /></span> : <InlineValue value={String(order[column.field] ?? '')} active={editing?.id === order.id && editing.field === column.field} onStart={() => { if (clickTimer.current) window.clearTimeout(clickTimer.current); setEditing({ id: order.id, field: column.field }) }} onCommit={(value) => commit(order.id, column.field, value)} onCancel={() => setEditing(null)} />}</td>)}
          <td className="row-more"><button onClick={(event) => { event.stopPropagation(); onOpenOrder(order.id) }} aria-label={`Open ${order.id}`}><ChevronRight size={16} /></button></td>
        </tr>)}{filtered.length === 0 && <tr><td colSpan={8} className="empty-table"><div className="empty-table-icon"><SearchIcon /></div><strong>No matching orders</strong><span>Try another name, reference or policy number.</span></td></tr>}</tbody></table></div>
        <div className="table-footer"><span><span className="table-live-dot" /> Data is saved in this workspace</span><button onClick={onViewHistory}>All order history <ChevronRight size={14} /></button></div>
      </div>
    </section>
    <div className="dashboard-footnote"><span><Sparkles size={13} /> Double-click a cell to edit <i>·</i> click a row for details</span></div>
  </div>
}

function Metric({ icon, label, value, note, tone, spark }: { icon: React.ReactNode; label: string; value: string; note: string; tone: string; spark: string }) {
  return <motion.div className={`metric-card metric-${tone}`} whileHover={{ y: -3, rotateX: 1 }} transition={{ duration: 0.2 }}><div className="metric-top"><span>{label}</span><span className={`metric-icon ${tone}`}>{icon}</span></div><div className="metric-number">{value}<span className={spark}><i /><i /><i /><i /><i /><i /><i /></span></div><div className="metric-bottom"><span>{note}</span><TrendingUp size={14} /></div></motion.div>
}
function SearchIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.5"/><path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> }
