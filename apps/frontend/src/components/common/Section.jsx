import React from "react";

export default function Section({ title, children, className = "" }) {
  return (
    <section className={`mb-6 ${className}`} aria-label={title}>
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      {children}
    </section>
  );
}
