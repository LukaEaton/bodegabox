import React, { createContext, useContext, useState, useCallback } from "react";
import { Alert } from "../components";

type AlertType = "Success" | "Error" | "Warning";

interface AlertContextType {
  setAlert: (message: string, type?: AlertType) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used within an AlertProvider");
  return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alert, setAlertState] = useState<{ message: string; type: AlertType } | null>(null);

  const setAlert = useCallback((message: string, type: AlertType = "Error") => {
    setAlertState({ message, type });

    setTimeout(() => setAlertState(null), 4000);
  }, []);

  return (
    <AlertContext.Provider value={{ setAlert }}>
      {children}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlertState(null)}
        />
      )}
    </AlertContext.Provider>
  );
};
