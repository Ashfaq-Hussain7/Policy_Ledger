import { useMemo, useState, type FormEvent } from 'react'
import { Check, CheckCircle2, Eye, EyeOff, KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

export function Settings({ userName, onPasswordSave }: { userName: string; onPasswordSave: () => void }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const checks = useMemo(() => ({ length: newPassword.length >= 8, number: /\d/.test(newPassword), mixed: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) }), [newPassword])
  const strength = Object.values(checks).filter(Boolean).length
  const canSubmit = currentPassword.length > 0 && strength >= 2 && newPassword === confirmPassword
  const initials = userName.slice(0, 2).toUpperCase()
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    if (!canSubmit) return
    onPasswordSave()
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setSubmitted(false)
  }

  return <div className="settings-page">
    <header className="settings-heading"><div><h1>Settings</h1></div><div className="settings-secure-chip"><ShieldCheck size={15} /> PRIVATE WORKSPACE</div></header>
    <div className="settings-layout">
      <motion.section className="settings-profile-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25 }}>
        <div className="settings-profile-main"><span className="settings-avatar">{initials}</span><div><h2>{userName}</h2><p>Operations · SV Ventures</p></div></div>
        <div className="settings-profile-divider" />
        <div className="settings-profile-row"><span>Workspace</span><strong>Operations desk</strong></div>
        <div className="settings-profile-row"><span>Account type</span><strong>Workspace administrator</strong></div>
        <div className="settings-profile-note"><CheckCircle2 size={14} /> Your changes stay in this browser preview.</div>
      </motion.section>

      <motion.section className="settings-security-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3, delay: .06 }}>
        <div className="settings-security-header"><span className="settings-key-icon"><KeyRound size={17} /></span><div><h2>Change password</h2><p>Choose a strong password you haven’t used before.</p></div></div>
        <form className="password-form" onSubmit={submit} noValidate>
          <PasswordField label="Current password" value={currentPassword} onChange={setCurrentPassword} visible={showPasswords} />
          <PasswordField label="New password" value={newPassword} onChange={setNewPassword} visible={showPasswords} />
          <div className="password-strength" aria-live="polite"><div className="strength-track">{[1, 2, 3].map((part) => <span key={part} className={strength >= part ? `strength-on strength-level-${strength}` : ''} />)}</div><span>{newPassword ? strength === 3 ? 'Strong' : strength === 2 ? 'Fair' : 'Add a little more strength' : 'Password strength'}</span></div>
          <div className="password-rules"><span className={checks.length ? 'rule-met' : ''}>{checks.length ? <Check size={12} /> : <i />}At least 8 characters</span><span className={checks.number ? 'rule-met' : ''}>{checks.number ? <Check size={12} /> : <i />}One number</span><span className={checks.mixed ? 'rule-met' : ''}>{checks.mixed ? <Check size={12} /> : <i />}Upper and lowercase letters</span></div>
          <PasswordField label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} visible={showPasswords} />
          {submitted && newPassword !== confirmPassword && <p className="password-error" role="alert">The new passwords don’t match.</p>}
          {submitted && strength < 2 && <p className="password-error" role="alert">Meet at least two password requirements to continue.</p>}
          <label className="show-password-toggle"><input type="checkbox" checked={showPasswords} onChange={(event) => setShowPasswords(event.target.checked)} /> Show passwords {showPasswords ? <EyeOff size={14} /> : <Eye size={14} />}</label>
          <div className="password-form-footer"><span><LockKeyhole size={13} /> Password is never saved in this demo.</span><button type="submit" className="button-primary password-submit" disabled={!canSubmit}>Update password <CheckCircle2 size={15} /></button></div>
        </form>
        <div className="settings-demo-note"><ShieldCheck size={15} /><span><strong>Preview mode</strong> — changes aren’t saved.</span></div>
      </motion.section>
    </div>
  </div>
}

function PasswordField({ label, value, onChange, visible }: { label: string; value: string; onChange: (value: string) => void; visible: boolean }) {
  return <label className="settings-input-field"><span>{label}</span><div className="settings-input-shell"><LockKeyhole size={15} /><input type={visible ? 'text' : 'password'} autoComplete={label === 'Current password' ? 'current-password' : 'new-password'} value={value} onChange={(event) => onChange(event.target.value)} placeholder="Enter password" /></div></label>
}
