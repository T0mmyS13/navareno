import React, { createContext, useState, useContext } from "react";
import "../styles/toast.css"; // Import your CSS for the toast notification

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [message, setMessage] = useState("");
    const [type, setType] = useState("success");
    const [visible, setVisible] = useState(false);

    const showToast = (msg, toastType) => {
        setMessage(msg);
        setType(toastType);
        setVisible(true);
        setTimeout(() => setVisible(false), 3000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {visible && (
                <div className={`toast show ${type}`}>
                    {message}
                </div>
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
