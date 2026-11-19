import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownRight, ArrowLeft, ArrowUpRight, ChevronDown, Eye, FileText, Highlighter, LockKeyhole, Save, X } from 'lucide-react'
import type { Order, OrderField } from './types'

const fieldGroups: { title: string; fields: { key: OrderField; label: string; kind?: string }[] }[] = [
  { title: 'POLICYHOLDER', fields: [{ key: 'customerName', label: 'Insured name' }, { key: 'email', label: 'Contact email', kind: 'email' }, { key: 'phone', label: 'Phone number' }, { key: 'region', label: 'Territory' }] },
  { title: 'POLICY DETAILS', fields: [{ key: 'policyNumber', label: 'Policy number' }, { key: 'policyType', label: 'Line of business' }, { key: 'effectiveDate', label: 'Effective date', kind: 'date' }, { key: 'expirationDate', label: 'Expiration date', kind: 'date' }, { key: 'premium', label: 'Annual premium' }, { key: 'broker', label: 'Broker of record' }, { key: 'status', label: 'Order status', kind: 'status' }] },
  { title: 'SOURCE & RECORD', fields: [{ key: 'id', label: 'Order reference' }, { key: 'sourceFile', label: 'Source document' }, { key: 'uploadedAt', label: 'Uploaded at', kind: 'datetime' }] },
]
const dateDisplay = (value: string) => { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) }

export function DetailDrawer({ order, sourceUrl, onClose, onSave }: { order: Order | null; sourceUrl?: string; onClose: () => void; onSave: (order: Order, originalId: string) => void }) {
  const [draft, setDraft] = useState<Order | null>(order)
  const [showPreview, setShowPreview] = useState(false)
  useEffect(() => setDraft(order), [order])
  useEffect(() => setShowPreview(false), [order?.id])
  const dirty = useMemo(() => !!draft && !!order && Object.keys(draft).some((key) => draft[key as OrderField] !== order[key as OrderField]), [draft, order])
  const update = (key: OrderField, event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setDraft((previous) => previous ? { ...previous, [key]: event.target.value } : previous)
  const save = () => { if (draft && order) onSave(draft, order.id) }
  const docUrl = sourceUrl || '/sample-policy.pdf'

  return <AnimatePresence>
    {order && draft && <>
      <motion.button className="drawer-backdrop" aria-label="Close order detail" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.aside className={`detail-drawer ${showPreview ? 'preview-open' : ''}`} layout initial={{ x: '103%' }} animate={{ x: 0 }} exit={{ x: '103%' }} transition={{ type: 'spring', damping: 30, stiffness: 270 }} aria-label={`Order ${order.id} details`}>
        <div className="drawer-header"><div><div className="drawer-eyebrow"><span className="table-live-dot" /> ORDER REVIEW · EDITABLE DETAILS</div><h2>{draft.id}<span className="drawer-edited-dot" title="All fields can be edited" /></h2><p>Uploaded {dateDisplay(order.uploadedAt)} · Review details beside the original document.</p></div><div className="drawer-header-actions"><button className="show-preview-button header-preview-toggle" onClick={() => setShowPreview((value) => !value)}>{showPreview ? <><ArrowLeft size={14} /> Hide preview</> : <><Eye size={14} /> Show preview</>}</button><button className="drawer-close" onClick={onClose} aria-label="Close details"><X size={19} /></button></div></div>
        <div className={`drawer-scroll ${showPreview ? '' : 'preview-collapsed'}`}>
          <motion.div layout="position" className="drawer-form-column" transition={{ duration: .35, ease: [.22, 1, .36, 1] }}>
            <div className="drawer-status-strip"><span className={`status-badge ${draft.status.toLowerCase().includes('bound') || draft.status.toLowerCase().includes('ready') ? 'green' : draft.status.toLowerCase().includes('review') ? 'amber' : 'blue'}`}><span />{draft.status}</span><span className="drawer-record-meta"><LockKeyhole size={12} /> Private workspace</span></div>
            {fieldGroups.map((group) => <section className="detail-field-group" key={group.title}><div className="field-group-title">{group.title}<span /></div><div className="detail-fields">{group.fields.map(({ key, label, kind }) => <label className="detail-field" key={key}><span>{label}</span>
              {kind === 'status' ? <div className="select-wrap"><select value={draft[key]} onChange={(event) => update(key, event)}><option>Ready to bind</option><option>In review</option><option>Needs review</option><option>Bound</option><option>Renewal due</option><option>Flagged</option></select><ChevronDown size={14} /></div>
                : <input type={kind === 'datetime' ? 'text' : kind || 'text'} value={draft[key]} onChange={(event) => update(key, event)} placeholder="Add a value" />}
            </label>)}</div></section>)}
          </motion.div>
          <AnimatePresence>{showPreview && <motion.div key="doc-col" className="drawer-document-column" initial={{ opacity: 0, x: 26 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 26 }} transition={{ duration: .3, ease: [.22, 1, .36, 1] }}><section className="source-viewer-card"><div className="source-viewer-head"><div className="source-file-icon"><FileText size={16} /></div><div className="source-file-copy"><strong>{draft.sourceFile || 'Source document'}</strong><span>ORIGINAL SOURCE DOCUMENT</span></div><button className="source-open" title="Open source in new tab" onClick={() => window.open(docUrl, '_blank', 'noopener,noreferrer')}><ArrowUpRight size={15} /></button></div>
            <div className="source-legend"><span><i className="legend-match" /> Extracted</span><span><i className="legend-edit" /> Edited in review</span><span className="source-page-count"><Highlighter size={12} /> FIELD MATCHES</span></div>
            <div className="source-frame"><iframe title={`Source document for ${draft.id}`} src={docUrl.includes('#') ? docUrl : `${docUrl}#toolbar=1&navpanes=0&view=FitH`} loading="lazy" /></div>
            <div className="source-match-notes"><div className="match-note"><span className="match-line line-teal" /><span><small>INSURED NAME</small><strong>{draft.customerName}</strong></span><ArrowDownRight size={14} /></div><div className="match-note"><span className="match-line line-green" /><span><small>POLICY NO.</small><strong>{draft.policyNumber}</strong></span><ArrowDownRight size={14} /></div><div className="match-note"><span className="match-line line-gold" /><span><small>ANNUAL PREMIUM</small><strong>{draft.premium}</strong></span><ArrowDownRight size={14} /></div><p className="highlight-disclaimer"><Highlighter size={12} /> The field matches reflect the latest values in this review.</p></div>
          </section></motion.div>}</AnimatePresence>
        </div>
        <AnimatePresence>{dirty && <motion.div className="drawer-save-bar" initial={{ y: 70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 70, opacity: 0 }}><div><span className="unsaved-indicator" /><span><strong>Unsaved changes</strong><small>Your edits are ready to keep.</small></span></div><button className="button-primary save-button" onClick={save}><Save size={15} /> Save changes</button></motion.div>}</AnimatePresence>
      </motion.aside>
    </>}
  </AnimatePresence>
}
