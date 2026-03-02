const TextInput = ({
  id,
  name,
  label,
  type = 'text',
  value,
  placeholder,
  onChange,
  error,
}) => {
  return (
    <div style={{ marginBottom: 14 }}>
      <label htmlFor={id} style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: 8,
          border: error ? '1px solid #dc2626' : '1px solid #cbd5e1',
          outline: 'none',
        }}
      />
      {error ? <small style={{ color: '#dc2626' }}>{error}</small> : null}
    </div>
  );
};

export default TextInput;
