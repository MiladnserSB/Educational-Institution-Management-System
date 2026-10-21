import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import ToastNotification from "../components/common/ToastNotification";

const ToastContext = createContext(null);

let toastCounter = 0;

/**
 * Global toast host built on the existing ToastNotification component:
 *   const { toast } = useToast();
 *   toast("success", "تم الحفظ بنجاح.");
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback(
    (id) => setToasts((list) => list.filter((toast) => toast.id !== id)),
    [],
  );

  const toast = useCallback(
    (type, message) => {
      const id = ++toastCounter;
      setToasts((list) => [...list, { id, type, message }]);
      window.setTimeout(
        () => setToasts((list) => list.filter((item) => item.id !== id)),
        4200,
      );
    },
    [],
  );

  const value = useMemo(() => ({ toasts, toast, dismissToast }), [
    toasts,
    toast,
    dismissToast,
  ]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-5 left-5 z-[60] flex w-[360px] max-w-[calc(100vw-2.5rem)] flex-col gap-2">
        {toasts.map((item) => (
          <ToastNotification
            key={item.id}
            type={item.type}
            message={item.message}
            onClose={() => dismissToast(item.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

export default ToastContext;
