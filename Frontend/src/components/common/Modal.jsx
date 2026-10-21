import React, { useEffect, useId } from "react";
import { classNames } from "../../utils";

const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnOverlay = true,
  closeOnEscape = true,
  closeLabel = "Close",
  className = "",
  headerClassName = "",
  contentClassName = "",
  footerClassName = "",
  ...props
}) => {
  const generatedId = useId();
  const titleId = `${generatedId}-title`;
  useEffect(() => {
    if (!open) return;
    const onKey = (event) =>
      closeOnEscape && event.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = oldOverflow;
    };
  }, [open, onClose, closeOnEscape]);

  if (!open) return null;
  return (
    <div
      className="ui-modal-backdrop"
      onMouseDown={(e) => {
        if (closeOnOverlay && e.target === e.currentTarget) onClose?.();
      }}
    >
      <section
        className={classNames("ui-modal", `ui-modal--${size}`, className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        {...props}
      >
        <header className={classNames("ui-modal-header", headerClassName)}>
          <div>
            {title && <h2 id={titleId}>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
          <button
            type="button"
            className="ui-icon-button"
            aria-label={closeLabel}
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className={classNames("ui-modal-content", contentClassName)}>
          {children}
        </div>
        {footer && (
          <footer className={`ui-modal-footer ${footerClassName}`}>
            {footer}
          </footer>
        )}
      </section>
    </div>
  );
};

export default Modal;
