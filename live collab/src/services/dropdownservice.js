import { useEffect, useRef, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { classNames } from '@/utils/helpers';

export default function Dropdown({ label, options, onSelect, value, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-ink-700 bg-white border border-ink-300 rounded-lg hover:bg-ink-100 transition-colors"
      >
        {value || label}
        <FiChevronDown size={14} className={classNames('transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div
          className={classNames(
            'absolute z-30 mt-1 w-44 card-surface py-1',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onSelect(opt);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-sm text-ink-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} //dropdownservice