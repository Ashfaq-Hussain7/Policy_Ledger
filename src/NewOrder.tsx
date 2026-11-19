import { useEffect, useRef, useState, type DragEvent, type ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, File, FileCheck2, FileText, Image, Plus, UploadCloud } from 'lucide-react'
import type { UploadFile, UploadRecord } from './types'

function formatBytes(bytes: number) {
  if (!bytes) return '—'
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
function formatDate(value: string) { return new Date(value).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) }
function isImage(fileName: string) { return /\.(png|jpe?g|webp)$/i.test(fileName) }

export function NewOrder({ currentUploads, previousUploads, onFiles, onProcess, onView, onBack }: {
  currentUploads: UploadFile[]
  previousUploads: UploadRecord[]
  onFiles: (files: File[]) => void
  onProcess: () => void
  onView: (item: UploadFile | UploadRecord) => void
  onBack: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [activeTab, setActiveTab] = useState<'current' | 'previous'>('current')
  const previousCount = useRef(currentUploads.length)
  const acceptFiles = (files: FileList | null) => { if (files?.length) onFiles(Array.from(files)) }
  const handleDrop = (event: DragEvent) => { event.preventDefault(); setDragging(false); acceptFiles(event.dataTransfer.files) }
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => { acceptFiles(event.target.files); event.target.value = '' }
  const visibleItems = activeTab === 'current' ? currentUploads : previousUploads

  useEffect(() => {
    if (currentUploads.length > previousCount.current) {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
    }
    previousCount.current = currentUploads.length
  }, [currentUploads.length])

  return <div className="new-order-page">
    <div className="page-kicker"><button onClick={onBack} className="back-link"><ArrowLeft size={15} /> Back to dashboard</button><span className="page-kicker-separator">/</span><span>INTAKE</span></div>
    <div className="new-order-title-row"><div><h1>Bring it into<br /><em>better focus.</em></h1></div></div>

    <div className="upload-layout">
      <section className={`dropzone-card ${dragging ? 'dragging' : ''}`} onDragOver={(event) => { event.preventDefault(); setDragging(true) }} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false) }} onDrop={handleDrop}>
        <input ref={inputRef} className="file-input-hidden" type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp" onChange={handleInput} />
        <div className="dropzone-art" aria-hidden="true"><div className="upload-orbit orbit-a" /><div className="upload-orbit orbit-b" /><motion.div className="upload-paper paper-one" animate={{ y: [0, -5, 0], rotateZ: [-9, -6, -9] }} transition={{ duration: 4.5, repeat: Infinity }}><span /><span /><span /></motion.div><motion.div className="upload-paper paper-two" animate={{ y: [0, 5, 0], rotateZ: [8, 10, 8] }} transition={{ duration: 5.5, repeat: Infinity }}><span /><span /><span /></motion.div><motion.div className="upload-icon-disc" animate={{ rotateY: [0, 8, 0] }} transition={{ duration: 4, repeat: Infinity }}><UploadCloud size={24} /></motion.div></div>
        <div className="dropzone-content"><div className="dropzone-label"><span className="secure-upload"><CheckCircle2 size={13} /> SECURE UPLOAD</span></div><h2>Drag and drop files here</h2><button className="button-primary select-files" onClick={() => inputRef.current?.click()}><Plus size={18} /> Choose files <ArrowRight size={16} /></button><div className="file-type-note"><span><FileText size={13} /> PDF</span><span><Image size={13} /> JPG / PNG</span><i /> Up to 25 MB</div></div>
      </section>

      <section className="upload-queue-card"><div className="queue-heading"><div><h2>Upload queue <span className="count-pill">{currentUploads.length}</span></h2></div><button className="queue-refresh" onClick={() => setActiveTab(activeTab === 'current' ? 'previous' : 'current')} title="Switch between current and previous uploads"><Clock3 size={16} /></button></div>
        <div className="queue-tabs"><button className={activeTab === 'current' ? 'active' : ''} onClick={() => setActiveTab('current')}>Current <span>{currentUploads.length}</span></button><button className={activeTab === 'previous' ? 'active' : ''} onClick={() => setActiveTab('previous')}>Previous <span>3</span></button></div>
        <div className="queue-list">{visibleItems.length ? visibleItems.map((item, index) => {
          const current = 'file' in item
          return <motion.div key={item.id} className="queue-item" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
            <div className={`queue-file-icon ${isImage(item.name) ? 'image-file' : ''}`}>{isImage(item.name) ? <Image size={17} /> : <FileText size={17} />}</div><div className="queue-file-info"><strong title={item.name}>{item.name}</strong><span>{formatBytes(item.size)} <i /> {formatDate(item.uploadedAt)}</span><small className={current ? 'queue-state current' : 'queue-state'}><span />{current ? 'Ready to review' : item.status}</small></div><button className="queue-view-button" onClick={() => onView(item)}>{current ? 'View' : 'View'} <ArrowRight size={13} /></button>
          </motion.div>
        }) : <div className="queue-empty"><div className="queue-empty-icon"><File size={20} /></div><strong>{activeTab === 'current' ? 'Your queue is clear.' : 'No previous uploads yet.'}</strong><span>{activeTab === 'current' ? 'Documents added here will be ready for review.' : 'Your latest three uploads will appear here.'}</span></div>}</div>
        {currentUploads.length > 0 && activeTab === 'current' && <div className="queue-bottom"><span><Check size={13} /> {currentUploads.length} document{currentUploads.length === 1 ? '' : 's'} ready</span><button className="button-primary process-button" onClick={onProcess}>Create review {currentUploads.length === 1 ? 'order' : 'orders'} <ArrowRight size={15} /></button></div>}
      </section>
    </div>
    <div className="intake-note"><div className="intake-note-icon"><FileCheck2 size={16} /></div><div><strong>Always source-first.</strong><span>New orders start as “Needs review” until verified.</span></div><button onClick={onBack} aria-label="Return to dashboard"><ArrowRight size={16} /></button></div>
  </div>
}
