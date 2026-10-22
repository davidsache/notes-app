import { useEffect, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

interface ModalProps {
  message: string,
  isOpen: boolean,
  onClose: () => void,
  onConfirm?: () => void,
}

export const Modal: React.FC<ModalProps> = ({ message, isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalRoot = document.getElementById('modal');
  if (!modalRoot) return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center z-1000"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg w-[90%] max-w-[500px] max-h-[90vh] overflow-y-auto shadow-[0_4px_12px_rgba(0,0,0,0.15)] p-8">
        <h2 className="text-xl font-bold">{t('Modal.confirmText')}</h2>
        <p>{message}</p>
        <button
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-bold px-5 py-3 sm:px-4 sm:py-2 my-2 me-2 text-xs sm:text-sm rounded"
          onClick={onConfirm}
        >
          {t('Modal.yes')}
        </button>
        <button
          className="bg-red-600 hover:bg-red-500 disabled:bg-red-400 text-white font-bold px-5 py-3 sm:px-4 sm:py-2 my-2 text-xs sm:text-sm rounded"
          onClick={onClose}
        >
          No
        </button>
      </div>
    </div>,
    modalRoot
  );
}