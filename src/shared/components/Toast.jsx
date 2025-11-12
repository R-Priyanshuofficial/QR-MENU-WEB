import { Toaster } from 'react-hot-toast'

export const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-center"
      reverseOrder={false}
      gutter={8}
      containerStyle={{
        bottom: 80,
      }}
      toastOptions={{
        duration: 2500,
        style: {
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          color: '#fff',
          padding: '14px 20px',
          borderRadius: '16px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: '320px',
        },
        success: {
          duration: 2500,
          style: {
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            boxShadow: '0 10px 40px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
          },
        },
        error: {
          duration: 3500,
          style: {
            background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
            boxShadow: '0 10px 40px rgba(239, 68, 68, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
          },
        },
        loading: {
          style: {
            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
            boxShadow: '0 10px 40px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#3b82f6',
          },
        },
      }}
    />
  )
}
