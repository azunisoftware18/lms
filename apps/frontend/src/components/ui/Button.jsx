const Button = ({ children, type = 'button', disabled = false, onClick }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        width: '100%',
        padding: '10px 14px',
        borderRadius: 8,
        border: 'none',
        background: disabled ? '#94a3b8' : '#2563eb',
        color: '#ffffff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
};

export default Button;
