import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modalType, setModalType] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  const resetUploadedImageUrl = () => setUploadedImageUrl(null);

  return (
    <ModalContext.Provider value={{ modalType, openModal, closeModal, uploadedImageUrl, setUploadedImageUrl, resetUploadedImageUrl }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
