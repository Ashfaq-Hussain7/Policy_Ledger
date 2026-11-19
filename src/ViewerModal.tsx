import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, FileText, Info, X } from 'lucide-react'

export function ViewerModal({ fileName, url, sampleMode, onClose }: { fileName: string | null; url: string | null; sampleMode: boolean; onClose: () => void }) {
  const isImage = Boolean(fileName && /\.(png|jpe?g|webp)$/i.test(fileName))
  return <AnimatePresence>{fileName && <motion.div className="viewer-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
    <motion.section className="viewer-modal" initial={{ opacity: 0, y: 18, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .99 }} transition={{ duration: .2 }} onMouseDown={(event) => event.stopPropagation()}>
      <header className="viewer-header"><div className="viewer-file-mark"><FileText size={17} /></div><div><span className="eyebrow">DOCUMENT PREVIEW</span><strong>{fileName}</strong></div><div className="viewer-header-actions">{url && <button onClick={() => window.open(url, '_blank', 'noopener,noreferrer')} className="viewer-open-tab"><ArrowUpRight size={15} /> Open in new tab</button>}<button onClick={onClose} className="drawer-close" aria-label="Close preview"><X size={18} /></button></div></header>
      {sampleMode && <div className="viewer-sample-note"><Info size={13} /> Demo archive preview — original uploaded files are held only in this browser session.</div>}
      <div className={`viewer-content ${isImage ? 'image-preview' : ''}`}>{url ? isImage ? <img src={url} alt={fileName || 'Uploaded source document'} /> : <iframe title={fileName || 'Document preview'} src={url.includes('#') ? url : `${url}#toolbar=1&navpanes=0&view=FitH`} /> : <div className="preview-unavailable"><FileText size={28} /><strong>Preview not available</strong><span>Open the original file from its saved location to view it.</span></div>}</div>
      <footer className="viewer-footer"><span><span className="table-live-dot" /> SOURCE FILE PREVIEW</span><span>Only people in your workspace can view this document</span></footer>
    </motion.section>
  </motion.div>}</AnimatePresence>
}
