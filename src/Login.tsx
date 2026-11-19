import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Check, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react'

const logo = '/sv-logo.jpeg'

export function Login({ onSignIn }: { onSignIn: (name: string) => void }) {
  const [email, setEmail] = useState('ops@svventures.com')
  const [password, setPassword] = useState('')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (email.trim() && password.trim()) onSignIn(email.trim().split('@')[0] || 'Operations team')
  }

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <div className="login-noise" />
        <div className="login-orbit login-orbit-one" />
        <div className="login-orbit login-orbit-two" />
        <motion.div className="brand-stage" initial={{ opacity: 0, y: 20, rotateX: 10 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <motion.div className="brand-logo-wrap" animate={{ y: [0, -8, 0], rotateY: [0, 4, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>
            <img className="login-logo" src={logo} alt="SV Ventures Insurance Solution" />
            <div className="logo-glow" />
          </motion.div>
          <div className="brand-copy">
            <h1>Every detail,<br /><em>in its right place.</em></h1>
          </div>
        </motion.div>
        <motion.div className="floating-glass glass-policy" animate={{ y: [0, -8, 0], rotateZ: [-4, -2, -4] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
          <div className="glass-icon"><ShieldCheck size={17} /></div>
          <div><span>POLICY REVIEW</span><strong>All in good order</strong></div>
          <span className="glass-check"><Check size={13} /></span>
        </motion.div>
        <motion.div className="floating-glass glass-count" animate={{ y: [0, 7, 0], rotateZ: [3, 1, 3] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
          <div className="count-orbit"><span /></div><div><span>THIS WEEK</span><strong>+18 <small>orders</small></strong></div><ArrowUpRight size={16} className="count-arrow" />
        </motion.div>
        <div className="brand-footnote"><span>SV</span><span className="footnote-rule" /> INSURANCE, WITH INTENTION</div>
      </section>

      <section className="login-form-panel">
        <div className="login-topline"><span className="mobile-brand"><img src={logo} alt="" /> SV VENTURES</span><span className="secure-note"><span className="secure-dot" /> SECURE WORKSPACE</span></div>
        <motion.div className="login-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.6 }}>
          <div className="login-mark"><Sparkles size={17} /></div>
          <h2>Good work starts<br />with a clear view.</h2>
          <p className="login-subtitle">Sign in to continue.</p>
          <form onSubmit={submit} className="login-form">
            <label htmlFor="email">Work email</label>
            <div className="input-shell"><Mail size={17} /><input autoComplete="username" id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required /></div>
            <div className="password-label"><label htmlFor="password">Password</label><button type="button" className="text-link">Need help?</button></div>
            <div className="input-shell"><LockKeyhole size={17} /><input autoComplete="current-password" id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required /></div>
            <button className="button-primary login-submit" type="submit">Open my workspace <ArrowRight size={16} /></button>
          </form>
          <div className="demo-note"><span className="demo-pulse" /> <span><strong>Interactive preview</strong> — enter any email and password</span></div>
        </motion.div>
        <div className="login-footer"><span>© 2026 SV Ventures Insurance Solution</span><span className="login-footer-links">Privacy <i /> Support</span></div>
      </section>
    </main>
  )
}
