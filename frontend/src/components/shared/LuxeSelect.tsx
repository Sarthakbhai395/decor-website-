'use client';

/**
 * LuxeSelect — custom animated dropdown that replaces all native <select>
 * elements. Opens inline (never a white browser popup), matches the dark
 * luxury theme, and works identically on mobile and desktop.
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LuxeSelectOption {
  value: string;
  label: string;
  icon?: string;
}

interface LuxeSelectProps {
  options: LuxeSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export default function LuxeSelect({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  label,
  className,
  size = 'md',
}: LuxeSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const py = size === 'sm' ? 'py-2' : 'py-2.5';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {label && (
        <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5">{label}</p>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={cn(
          'w-full flex items-center justify-between gap-2 px-3.5 rounded-xl border transition-all duration-200 text-left',
          py, textSize,
          open
            ? 'border-gold-500/60 bg-gold-500/8'
            : 'border-white/10 bg-white/5 hover:border-gold-500/30',
        )}
        style={open ? { background: 'rgba(201,169,110,0.06)' } : {}}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? 'text-white' : 'text-white/35'}>
          {selected ? (
            <span className="flex items-center gap-1.5">
              {selected.icon && <span>{selected.icon}</span>}
              {selected.label}
            </span>
          ) : placeholder}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-3.5 h-3.5 text-white/40" />
        </motion.div>
      </button>

      {/* Dropdown panel — renders in-flow, never a portal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.92 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.92 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              transformOrigin: 'top',
              background: 'rgba(15,15,15,0.97)',
              border: '1px solid rgba(201,169,110,0.22)',
              backdropFilter: 'blur(16px)',
              zIndex: 50,
            }}
            className="absolute left-0 right-0 top-full mt-1.5 rounded-xl overflow-hidden shadow-luxury"
            role="listbox"
          >
            <div className="max-h-52 overflow-y-auto no-scrollbar py-1">
              {options.map((opt) => {
                const isActive = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => { onChange(opt.value); setOpen(false); }}
                    className={cn(
                      'w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-left transition-all duration-150',
                      textSize,
                      isActive
                        ? 'text-gold-400 bg-gold-500/10'
                        : 'text-white/70 hover:text-white hover:bg-white/5',
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {opt.icon && <span className="text-base leading-none">{opt.icon}</span>}
                      {opt.label}
                    </span>
                    {isActive && <Check className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
