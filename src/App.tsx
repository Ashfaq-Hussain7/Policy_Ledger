import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, CheckCircle2, Info, X } from 'lucide-react'
import { Dashboard } from './Dashboard'
import { DetailDrawer } from './DetailDrawer'
import { History } from './History'
import { Login } from './Login'
import { NewOrder } from './NewOrder'
import { Settings } from './Settings'
import { Shell } from './Shell'
import { ViewerModal } from './ViewerModal'
import { demoActivity, demoOrders, demoUploads } from './data'
import type { ActivityItem, Order, OrderField, UploadFile, UploadRecord } from './types'

type View = 'Dashboard' | 'New Order' | 'History' | 'Settings'
type Notice = { message: string; tone: 'success' | 'info' | 'error' } | null
type ViewerState = { name: string; url: string; sampleMode: boolean } | null

function readStorage<T>(key: string, fallback: T): T {
  try { const stored = localStorage.getItem(key); return stored ? JSON.parse(stored) as T : fallback } catch { return fallback }
}
function activity(kind: ActivityItem['kind'], title: string, detail: string): ActivityItem {
  return { id: `AC-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, title, detail, createdAt: new Date().toISOString(), kind }
}

export default function App() {
  const [signedIn, setSignedIn] = useState(() => localStorage.getItem('sv:session') === 'active')
  const [userName, setUserName] = useState(() => localStorage.getItem('sv:user') || 'Operations')
  const [view, setView] = useState<View>('Dashboard')
  const [orders, setOrders] = useState<Order[]>(() => readStorage('sv:orders', demoOrders))
  const [uploads, setUploads] = useState<UploadRecord[]>(() => readStorage('sv:uploads', demoUploads))
  const [activityLog, setActivityLog] = useState<ActivityItem[]>(() => readStorage('sv:activity', demoActivity))
  const [currentUploads, setCurrentUploads] = useState<UploadFile[]>([])
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({})
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState<Notice>(null)
  const [viewer, setViewer] = useState<ViewerState>(null)
  const selectedOrder = useMemo(() => orders.find((order) => order.id === selectedId) || null, [orders, selectedId])
  const previousUploads = useMemo(() => uploads.filter((upload) => !currentUploads.some((current) => current.id === upload.id)).slice(0, 3), [uploads, currentUploads])

  useEffect(() => { localStorage.setItem('sv:orders', JSON.stringify(orders)) }, [orders])
  useEffect(() => { localStorage.setItem('sv:uploads', JSON.stringify(uploads)) }, [uploads])
  useEffect(() => { localStorage.setItem('sv:activity', JSON.stringify(activityLog)) }, [activityLog])
  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(null), 3600); return () => window.clearTimeout(timer) }, [notice])

  const signIn = (name: string) => {
    setUserName(name ? name[0].toUpperCase() + name.slice(1) : 'Operations')
    localStorage.setItem('sv:session', 'active')
    localStorage.setItem('sv:user', name || 'Operations')
    setSignedIn(true)
    setView('Dashboard')
  }
  const signOut = () => { localStorage.removeItem('sv:session'); localStorage.removeItem('sv:user'); setSignedIn(false); setSelectedId(null); setNotice(null) }
  const addNotice = (message: string, tone: NonNullable<Notice>['tone'] = 'success') => setNotice({ message, tone })
  const patchOrder = (id: string, field: OrderField, value: string) => {
    setOrders((previous) => previous.map((order) => order.id === id ? { ...order, [field]: value } : order))
    if (field === 'id' && selectedId === id) setSelectedId(value)
    addNotice('Cell updated. Your change is saved in this workspace.', 'success')
  }
  const saveOrder = (updated: Order, originalId: string) => {
    setOrders((previous) => previous.map((order) => order.id === originalId ? updated : order))
    setSelectedId(updated.id)
    setActivityLog((previous) => [activity('edit', 'Policy details updated', `${updated.id} · ${updated.customerName}`), ...previous].slice(0, 40))
    addNotice('Changes saved. The order record is up to date.', 'success')
  }
  const addFiles = (files: File[]) => {
    const accepted = files.filter((file) => file.size <= 25 * 1024 * 1024 && /\.(pdf|png|jpe?g|webp)$/i.test(file.name))
    if (accepted.length !== files.length) addNotice('Some files were skipped. Choose PDF, JPG, PNG or WEBP files under 25 MB.', 'error')
    if (!accepted.length) return
    const next: UploadFile[] = accepted.map((file) => ({ id: `UP-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name: file.name, size: file.size, uploadedAt: new Date().toISOString(), kind: file.type.startsWith('image/') ? 'Image document' : 'PDF document', status: 'Ready to review', file, objectUrl: URL.createObjectURL(file) }))
    setCurrentUploads((previous) => [...previous, ...next])
    setUploads((previous) => [...next.map(({ file: _file, objectUrl: _url, ...record }) => record), ...previous].slice(0, 40))
    setPreviewUrls((previous) => ({ ...previous, ...Object.fromEntries(next.map((item) => [item.name, item.objectUrl || ''])) }))
    setActivityLog((previous) => [...next.map((item) => activity('upload', 'Document received', item.name)), ...previous].slice(0, 40))
    addNotice(`${accepted.length} document${accepted.length === 1 ? '' : 's'} added to the review queue.`, 'success')
  }
  const processQueue = () => {
    if (!currentUploads.length) return
    const maxRef = Math.max(2084, ...orders.map((order) => Number(order.id.replace(/\D/g, '')) || 0))
    const created = currentUploads.map((upload, index): Order => {
      const reference = `SV-${maxRef + index + 1}`
      const baseName = upload.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim()
      return { id: reference, customerName: baseName ? baseName.replace(/\b\w/g, (letter) => letter.toUpperCase()) : 'New submission', policyNumber: 'Pending verification', policyType: 'Submission document', effectiveDate: '—', expirationDate: '—', premium: 'Pending', broker: 'Unassigned', region: '—', email: '—', phone: '—', status: 'Needs review', sourceFile: upload.name, uploadedAt: upload.uploadedAt }
    })
    const ids = new Set(currentUploads.map((item) => item.id))
    setOrders((previous) => [...created, ...previous])
    setUploads((previous) => previous.map((record) => ids.has(record.id) ? { ...record, status: 'Added to orders' } : record))
    setActivityLog((previous) => [...created.map((order) => activity('order', 'Review order created', `${order.id} · ${order.customerName}`)), ...previous].slice(0, 40))
    setCurrentUploads([])
    setSelectedId(created[0]?.id || null)
    setView('Dashboard')
    addNotice(`${created.length} review-ready order${created.length === 1 ? '' : 's'} created. Details are ready to verify.`, 'success')
  }
  const viewUpload = (item: UploadFile | UploadRecord) => {
    const isCurrent = 'objectUrl' in item && Boolean(item.objectUrl)
    setViewer({ name: item.name, url: isCurrent ? (item as UploadFile).objectUrl! : '/sample-policy.pdf', sampleMode: !isCurrent })
  }
  const viewOrderSource = (order: Order) => {
    const url = previewUrls[order.sourceFile]
    setViewer({ name: order.sourceFile || `${order.id} source document`, url: url || '/sample-policy.pdf', sampleMode: !url })
  }
  const openNewOrder = () => { setSelectedId(null); setView('New Order') }
  const confirmPasswordUpdate = () => addNotice('Password rules passed. Connect an authentication provider to apply this change to a real account.', 'info')

  if (!signedIn) return <><Login onSignIn={signIn} />{notice && <Toast notice={notice} onClose={() => setNotice(null)} />}</>
  return <>
    <Shell view={view} onNavigate={(next) => { setSelectedId(null); setView(next) }} onSignOut={signOut} search={search} onSearch={setSearch} userName={userName}>
      {view === 'Dashboard' && <Dashboard orders={orders} search={search} onNewOrder={openNewOrder} onOpenOrder={(id) => setSelectedId((current) => current === id ? null : id)} onPatch={patchOrder} onViewHistory={() => { setSelectedId(null); setView('History') }} />}
      {view === 'New Order' && <NewOrder currentUploads={currentUploads} previousUploads={previousUploads} onFiles={addFiles} onProcess={processQueue} onView={viewUpload} onBack={() => setView('Dashboard')} />}
      {view === 'History' && <History orders={orders} uploads={uploads} search={search} onViewOrder={viewOrderSource} onViewUpload={viewUpload} />}
      {view === 'Settings' && <Settings userName={userName} onPasswordSave={confirmPasswordUpdate} />}
    </Shell>
    <DetailDrawer order={selectedOrder} sourceUrl={selectedOrder ? previewUrls[selectedOrder.sourceFile] : undefined} onClose={() => setSelectedId(null)} onSave={saveOrder} />
    <ViewerModal fileName={viewer?.name || null} url={viewer?.url || null} sampleMode={viewer?.sampleMode || false} onClose={() => setViewer(null)} />
    {notice && <Toast notice={notice} onClose={() => setNotice(null)} />}
  </>
}

function Toast({ notice, onClose }: { notice: NonNullable<Notice>; onClose: () => void }) {
  const Icon = notice.tone === 'success' ? CheckCircle2 : Info
  return <AnimatePresence><motion.div className={`toast toast-${notice.tone}`} initial={{ opacity: 0, y: 15, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} role="status"><span className="toast-icon"><Icon size={17} /></span><span>{notice.message}</span><button onClick={onClose} aria-label="Dismiss notification"><X size={15} /></button>{notice.tone === 'success' && <Check className="toast-check" size={13} />}</motion.div></AnimatePresence>
}
