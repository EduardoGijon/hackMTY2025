interface AlertProps {
  children: React.ReactNode;
  variant?: 'warning' | 'danger' | 'info';
}

export function Alert({ children, variant = 'info' }: AlertProps) {
  const getAlertStyle = () => {
    switch (variant) {
      case 'warning':
        return {
          backgroundColor: '#FEF3C7',
          borderColor: '#F59E0B',
          color: '#92400E'
        };
      case 'danger':
        return {
          backgroundColor: '#FEE2E2',
          borderColor: '#EF4444',
          color: '#991B1B'
        };
      default:
        return {
          backgroundColor: '#DBEAFE',
          borderColor: '#3B82F6',
          color: '#1E40AF'
        };
    }
  };

  return (
    <div 
      className="p-4 rounded-lg border-l-4"
      style={getAlertStyle()}
    >
      {children}
    </div>
  );
}