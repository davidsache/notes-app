import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Modal } from "../components/Modal";

interface ModalOptions {
  message?: string;
  onConfirm?: () => void;
}

interface ModalContextType {
  openModal: (options: ModalOptions) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalData, setModalData] = useState<ModalOptions | null>(null);
  const location = useLocation();

  const openModal = useCallback((options: ModalOptions) => {
    setModalData(options);
  }, [])
  
  const closeModal = useCallback(() => {
    setModalData(null);
  }, []);

  useEffect(() => {
    closeModal();
  }, [location.pathname]);

  return (
    <ModalContext.Provider value={{ openModal }}>
      {children}
      <Modal 
        isOpen={modalData !== null} 
        onClose={closeModal} 
        message={modalData?.message ?? ""}
        onConfirm={modalData?.onConfirm ? () => {
          modalData.onConfirm!();
          closeModal();
        }: undefined}
      />
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};