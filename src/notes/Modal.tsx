import { type ReactNode, useEffect, useRef } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  label: string;
  className?: string;
  children: ReactNode;
};

/** native <dialog>: focus trap, Esc and ::backdrop for free. Children mount only while open. */
const Modal = ({ open, onClose, label, className = '', children }: Props) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Esc already closes the dialog natively, the click is only for the backdrop
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={`m-auto rounded border border-outline-variant bg-surface text-on-surface p-0 overflow-hidden backdrop:bg-black/50 ${className}`}
    >
      {open && children}
    </dialog>
  );
};

export default Modal;
