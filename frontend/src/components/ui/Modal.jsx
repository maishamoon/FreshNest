import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/helpers';

export function Modal({ isOpen, onClose, title, children, className }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocused = document.activeElement;

    // Focus first input or interactive element instead of close button
    const container = dialogRef.current;
    if (container) {
      const inputs = container.querySelectorAll('input, textarea, button, select');
      if (inputs.length > 0) {
        // Skip close button and focus first form input
        const firstInput = inputs[0];
        if (firstInput.getAttribute('aria-label') !== 'Close dialog') {
          firstInput.focus();
        } else if (inputs.length > 1) {
          inputs[1].focus();
        }
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const container = dialogRef.current;
      if (!container) return;

      const focusableNodes = container.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusableNodes.length) return;

      const firstElement = focusableNodes[0];
      const lastElement = focusableNodes[focusableNodes.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className={cn('relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto', className)}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 id={titleId} className="text-lg font-semibold">{title}</h3>
          <button ref={closeButtonRef} type="button" onClick={onClose} className="p-1 hover:bg-gray-100 rounded" aria-label="Close dialog">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}