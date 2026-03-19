import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom"; // Portal ke liye
import { MoreVertical } from "lucide-react";

export default function ActionMenu({
  actions = [],
  containerClassName = "",
  menuClassName = "",
  align = "right",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 }); // Menu ki position ke liye
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  const handleToggle = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: align === "right" ? rect.right + window.scrollX : rect.left + window.scrollX,
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
        triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsOpen(false);
    };

    if (isOpen) {
      window.addEventListener("scroll", handleScroll, true);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  // alignment class adjustment
  const alignmentClass = align === "right" ? "-translate-x-full" : "";

  const renderActionIcon = (icon, isDanger) => {
    if (!icon) return null;

    const baseClass = isDanger
      ? "text-red-500"
      : "text-gray-400 group-hover:text-blue-500";

    if (React.isValidElement(icon)) {
      return (
        <span className={`mr-3 transition-colors ${baseClass}`}>
          {icon}
        </span>
      );
    }

    const IconComponent = icon;
    return (
      <span className={`mr-3 transition-colors ${baseClass}`}>
        <IconComponent size={16} />
      </span>
    );
  };

  return (
    <div className={`relative inline-block ${containerClassName}`}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className={`p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-100 
          ${isOpen ? 'bg-gray-100 text-blue-600' : 'hover:bg-gray-100 text-gray-500'}`}
      >
        <MoreVertical size={20} />
      </button>

      {/* Menu Panel using Portal */}
      {isOpen && createPortal(
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            zIndex: 9999 // Sabse upar dikhne ke liye
          }}
          className={`mt-2 w-52 rounded-xl border border-gray-100 
            bg-white shadow-2xl focus:outline-none 
            animate-in fade-in zoom-in-95 duration-100 ${alignmentClass} ${menuClassName}`}
          role="menu"
        >
          <div className="py-1.5 px-1.5">
            {actions.map((action, index) => (
              <React.Fragment key={index}>
                {action.divider && <div className="my-1 border-t border-gray-100" />}
                <button
                  onClick={() => {
                    action.onClick?.();
                    setIsOpen(false);
                  }}
                  disabled={action.disabled}
                  className={`flex w-full items-center px-3 py-2 text-sm rounded-lg transition-colors group
                    ${action.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                    ${action.isDanger
                      ? "text-red-600 hover:bg-red-50"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    }`}
                  role="menuitem"
                >
                  {renderActionIcon(action.icon, action.isDanger)}
                  <span className="flex-1 text-left font-medium">{action.label}</span>
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}