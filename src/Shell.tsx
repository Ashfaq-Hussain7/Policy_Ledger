import type { ReactNode } from 'react'
import { Bell, ChevronDown, Command, FileClock, LayoutDashboard, LogOut, Search, Settings2, UploadCloud } from 'lucide-react'
import { motion } from 'framer-motion'

const logo = '/sv-logo.jpeg'
type View = 'Dashboard' | 'New Order' | 'History' | 'Settings'
type NavLabel = View | 'Sign out'

export function Shell({ children, view, onNavigate, onSignOut, search, onSearch, userName }: {
  children: ReactNode
  view: View
  onNavigate: (next: View) => void
  onSignOut: () => void
  search: string
  onSearch: (value: string) => void
  userName: string
}) {
  const items: { label: NavLabel; icon: typeof LayoutDashboard }[] = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'New Order', icon: UploadCloud },
    { label: 'History', icon: FileClock },
    { label: 'Sign out', icon: LogOut },
  ]
  const initials = userName.slice(0, 2).toUpperCase()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="sidebar-brand" onClick={() => onNavigate('Dashboard')} aria-label="Go to dashboard"><img src={logo} alt="SV Ventures" /><span className="sidebar-brand-text"><strong>SV <b>VENTURES</b></strong><small>INSURANCE SOLUTION</small></span></button>
        <div className="workspace-chip"><span className="workspace-avatar">S</span><span><small>WORKSPACE</small><strong>Operations desk</strong></span><ChevronDown size={14} /></div>
        <nav className="side-nav" aria-label="Primary navigation">
          {items.map(({ label, icon: Icon }) => {
            const isSignOut = label === 'Sign out'
            const selected = !isSignOut && view === label
            return <button key={label} className={`nav-item ${selected ? 'active' : ''} ${isSignOut ? 'mobile-signout' : ''}`} onClick={() => isSignOut ? onSignOut() : onNavigate(label)}><Icon size={18} strokeWidth={1.8} /><span>{label === 'New Order' ? 'Orders' : label}</span>{label === 'Dashboard' && <span className="nav-count">07</span>}{selected && <motion.span layoutId="nav-indicator" className="nav-indicator" />}</button>
          })}
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-support"><div className="support-orb"><span /></div><div><strong>Here to help</strong></div><button className="support-arrow" aria-label="Contact support"><ArrowMark /></button></div>
        <button className="nav-item sign-out" onClick={onSignOut}><LogOut size={17} /><span>Sign out</span></button>
        <div className="sidebar-bottom"><span className="online-dot" /> All systems operational <span className="version-label">v1.0</span></div>
      </aside>

      <div className="main-column">
        <header className="topbar"><div className="breadcrumbs"><span>SV WORKSPACE</span><i>/</i><strong>{view === 'New Order' ? 'New order' : view}</strong></div>
          <div className="topbar-tools"><label className="global-search"><Search size={16} /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search orders..." aria-label="Search orders" /><kbd><Command size={11} /> K</kbd></label>
            <button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><span /></button>
            <button className={`user-chip settings-chip ${view === 'Settings' ? 'settings-active' : ''}`} onClick={() => onNavigate('Settings')} aria-label="Open settings"><span className="user-avatar">{initials}</span><span className="user-chip-copy"><strong>Settings</strong><small>{userName}</small></span><Settings2 size={16} /></button>
          </div>
        </header>
        <motion.main className="page-content" key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .28, ease: 'easeOut' }}>{children}</motion.main>
      </div>
    </div>
  )
}
function ArrowMark() { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 12.5 12.5 3.5M5 3.5h7.5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> }
