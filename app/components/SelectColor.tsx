import React, { useState, useEffect } from "react";

type SelectColorProps = {
  value?: boolean;
  onChange?: (color: boolean) => void;
  options?: boolean[];
};

export default function SelectColor({ value, onChange, options = [true, false] }: SelectColorProps) {
  const [corUser, setCorUser] = useState<boolean>(value ?? true);

  useEffect(() => {
    if (value !== undefined && value !== corUser) {
      setCorUser(value);
    }
  }, [value]);

  const toggle = () => {
    const newColor = corUser === true ? false : true;
    setCorUser(newColor);
    onChange?.(newColor);
  };

  return (
    <div className="mb-8 flex items-center gap-4">
      <span className={`font-semibold ${corUser === true ? "text-white" : "text-gray-400"}`}>⚪ Brancas</span>

      <button onClick={toggle} aria-pressed={corUser === false} className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${corUser === true ? "bg-gray-300" : "bg-gray-600"}`}>
        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${corUser === true ? "left-1" : "translate-x-8 left-1"}`} />
      </button>

      <span className={`font-semibold ${corUser === false ? "text-white" : "text-gray-400"}`}>⚫ Pretas</span>
    </div>
  );
}
