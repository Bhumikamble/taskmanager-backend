import React from "react";

export function Input({ type, value, onChange, placeholder, className }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border rounded px-2 py-1 ${className}`}
    />
  );
}
