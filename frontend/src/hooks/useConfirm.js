import { useState, useCallback } from 'react';

export function useConfirm() {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'danger',
    onConfirm: () => {},
  });

  const confirm = useCallback(
    ({ title, message, type = 'danger', confirmText, cancelText }) => {
      return new Promise((resolve) => {
        setConfirmState({
          isOpen: true,
          title,
          message,
          type,
          confirmText,
          cancelText,
          onConfirm: () => {
            resolve(true);
            setConfirmState((prev) => ({ ...prev, isOpen: false }));
          },
        });
      });
    },
    []
  );

  const closeConfirm = useCallback(() => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return { confirmState, confirm, closeConfirm };
}
