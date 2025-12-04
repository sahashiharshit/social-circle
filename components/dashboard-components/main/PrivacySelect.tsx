"use client";
import { useState, useRef, useEffect, JSX } from "react";
import { FaGlobe, FaLock, FaUserFriends } from "react-icons/fa";

export type PrivacyValue = "public" | "private" | "friends";
type PrivacyOption = {
  value: PrivacyValue;
  label: string;
  icon: JSX.Element;
};
const OPTIONS:PrivacyOption[] = [
  { value: "public", label: "Public", icon: <FaGlobe size={12} /> },
  { value: "private", label: "Private", icon: <FaLock size={12} /> },
  { value: "friends", label: "Friends", icon: <FaUserFriends size={12} /> },
];

export default function PrivacySelect({
  value,
  onChange,
  name
}: {
  value: PrivacyValue;
  onChange: (v: PrivacyValue) => void;
  name: string;
}) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  // close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (container.current && !container.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = OPTIONS.find(o => o.value === value)!;

  return (
    <div ref={container} className="relative w-[110px] text-xs">
      {/* hidden input for server action */}
      <input type="hidden" name={name} value={value} />

      {/* Trigger */}
      <button
        type="button"
        className="w-full flex items-center justify-between bg-gray-800/50 text-white px-2 py-1 rounded-md border border-gray-600"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-1">
          {selected.icon}
          {selected.label}
        </span>
        <span className="text-gray-400">▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-20">
          {OPTIONS.map(opt => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="cursor-pointer px-2 py-1 text-white flex items-center gap-2 hover:bg-gray-700/50"
            >
              {opt.icon}
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
