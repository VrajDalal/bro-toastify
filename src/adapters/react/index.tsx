import React, { useEffect, useState, useCallback } from 'react';
import { broToastify as coreToast, on } from '../../core/bro-toastify'
import { BroToastify, BroToastifyToastifyOptions } from '../../core/types';

// React component for toast container
export const ToastContainer: React.FC<{
  position?: BroToastifyToastifyOptions['position'],
  newestOnTop?: boolean
}> = ({ 
  position = 'top-right',
  newestOnTop = true
}) => {
  const [toasts, setToasts] = useState<BroToastify[]>([]);
  
  useEffect(() => {
    // Subscribe to toast events
    const createUnsubscribe = on('create', (toast: BroToastify) => {
      if (toast.position === position) {
        setToasts(prev => {
          const newToasts = [...prev, toast];
          return newestOnTop ? newToasts : newToasts.reverse();
        });
      }
    });
    
    const dismissUnsubscribe = on('dismiss', (toast: BroToastify) => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    });
    
    // Cleanup
    return () => {
      createUnsubscribe();
      dismissUnsubscribe();
    };
  }, [position, newestOnTop]);
  
  return (
    <div className={`toast-container toast-${position}`}>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

// Individual toast component
const ToastItem: React.FC<{ toast: BroToastify }> = ({ toast }) => {
  const { id, type, message, title, dismissible } = toast;
  
  const handleDismiss = useCallback(() => {
    coreToast.dismiss(id);
  }, [id]);
  
  return (
    <div 
      className={`toast-notification toast-${type} ${toast.customClass || ''}`}
      role="alert"
      onClick={toast.onClick}
    >
      {title && <div className="toast-title">{title}</div>}
      <div className="toast-message">{message}</div>
      
      {dismissible && (
        <button 
          className="toast-close" 
          aria-label="Close"
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
        >
          &times;
        </button>
      )}
    </div>
  );
};

// Hook for using toast
export const broToastify = () => {
  return {
    show: (message: string, options?: Partial<BroToastifyToastifyOptions>) => 
      coreToast.show(message, options),
    success: (message: string, options?: Partial<BroToastifyToastifyOptions>) => 
      coreToast.success(message, options),
    error: (message: string, options?: Partial<BroToastifyToastifyOptions>) => 
      coreToast.error(message, options),
    info: (message: string, options?: Partial<BroToastifyToastifyOptions>) => 
      coreToast.info(message, options),
    warning: (message: string, options?: Partial<BroToastifyToastifyOptions>) => 
      coreToast.warning(message, options),
    dismiss: coreToast.dismiss,
    clearAll: coreToast.clearAll
  };
};

// Export the core toast for direct usage
export const toast = coreToast;