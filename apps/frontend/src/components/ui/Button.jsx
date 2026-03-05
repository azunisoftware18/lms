import React from 'react';

// Props: children (text), onClick (function), type (button/submit), aur className (extra styles)
function Button({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center gap-2
        bg-blue-600 text-white
        px-5 py-2.5
        rounded-xl
        font-medium
        shadow-sm
        hover:bg-blue-700
        transition-all
        disabled:opacity-60
        disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;