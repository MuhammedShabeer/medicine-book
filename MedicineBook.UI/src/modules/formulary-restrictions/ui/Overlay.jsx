import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './icons.jsx';

/** Renders overlays at the end of <body> so host layouts (overflow, transforms, z-index) cannot clip them. */
export function Layer({ dark, children }) {
  return createPortal(<div className={'hfr-layer' + (dark ? ' hfr-dark' : '')}>{children}</div>, document.body);
}

export function Toast({ toast }) {
  return (
    <div className={'hfr-toast' + (toast ? ' hfr-on' : '')} role="status" aria-live="polite">
      {toast && <><Icon name={toast.icon} />{toast.text}</>}
    </div>
  );
}

/** Accessible modal dialog: traps nothing fancy, but restores focus and closes on Escape or backdrop click. */
export function Modal({ title, small, onClose, children, footer }) {
  const box = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  // Runs once per opening: focusing on every render would steal focus while the user types.
  useEffect(() => {
    const prev = document.activeElement;
    const first = box.current?.querySelector('input:not([readonly]),textarea,select,.hfr-mb button');
    first?.focus();
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); closeRef.current(); } };
    window.addEventListener('keydown', onKey, true);
    return () => { window.removeEventListener('keydown', onKey, true); prev?.focus?.(); };
  }, []);
  return (
    <div className="hfr-modal" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={'hfr-mbox' + (small ? ' hfr-small' : '')} role="dialog" aria-modal="true" aria-label={title} ref={box}>
        <div className="hfr-mh"><h3>{title}</h3><button className="hfr-btn hfr-sm" onClick={onClose} aria-label="Close"><Icon name="X" /></button></div>
        <div className="hfr-mb">{children}</div>
        {footer && <div className="hfr-mf">{footer}</div>}
      </div>
    </div>
  );
}

export function Confirm({ title, text, action, onConfirm, onClose }) {
  return (
    <Modal small title={title} onClose={onClose} footer={<>
      <button className="hfr-btn" onClick={onClose}>Cancel</button>
      <button className="hfr-btn hfr-pri" style={{ background: 'var(--hfr-red)', borderColor: 'var(--hfr-red)' }} onClick={() => { onClose(); onConfirm(); }}>{action}</button>
    </>}>
      <p style={{ fontSize: 14, color: 'var(--hfr-ink-2)' }}>{text}</p>
    </Modal>
  );
}
