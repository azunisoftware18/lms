const Alert = ({ message }) => {
  if (!message) return null;

  return (
    <div
      style={{
        marginBottom: 14,
        padding: '10px 12px',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: 8,
        color: '#b91c1c',
      }}
    >
      {message}
    </div>
  );
};

export default Alert;
