const Card = ({ title, subtitle, children }) => {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 420,
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 10px 25px rgba(2, 6, 23, 0.08)',
      }}
    >
      {title ? <h2 style={{ margin: 0 }}>{title}</h2> : null}
      {subtitle ? <p style={{ color: '#475569', marginTop: 8 }}>{subtitle}</p> : null}
      <div style={{ marginTop: 16 }}>{children}</div>
    </div>
  );
};

export default Card;
