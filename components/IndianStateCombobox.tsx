'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { filterStatesByQuery, normalizeIndianState } from '@/lib/indianAddress';

type Props = {
    value: string;
    onChange: (canonicalState: string) => void;
    className?: string;
};

export function IndianStateCombobox({ value, onChange, className = 'form-input' }: Props) {
    const listboxId = useId();
    const [input, setInput] = useState(value);
    const [open, setOpen] = useState(false);
    const [highlight, setHighlight] = useState(0);
    const wrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInput(value);
    }, [value]);

    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    const list = filterStatesByQuery(input, 20);

    useEffect(() => {
        setHighlight(0);
    }, [input]);

    const commitIfExact = (text: string) => {
        const n = normalizeIndianState(text.trim());
        if (n && text.trim().toLowerCase() === n.toLowerCase()) {
            onChange(n);
            setInput(n);
            return true;
        }
        return false;
    };

    const pick = (name: string) => {
        onChange(name);
        setInput(name);
        setOpen(false);
    };

    const handleBlur = () => {
        window.setTimeout(() => {
            if (commitIfExact(input)) {
                setOpen(false);
                return;
            }
            const n = normalizeIndianState(input);
            if (n) {
                onChange(n);
                setInput(n);
                setOpen(false);
                return;
            }
            const q = input.trim().toLowerCase();
            const matches = filterStatesByQuery(input, 50);
            if (matches.length === 1 && matches[0].toLowerCase().startsWith(q)) {
                pick(matches[0]);
                return;
            }
            onChange('');
            setInput('');
            setOpen(false);
        }, 120);
    };

    return (
        <div ref={wrapRef} style={{ position: 'relative' }}>
            <input
                type="text"
                className={className}
                placeholder="Search state (e.g. Telangana, Tamil Nadu)"
                value={input}
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={open}
                aria-controls={listboxId}
                style={{ marginBottom: 0 }}
                onChange={(e) => {
                    const v = e.target.value;
                    setInput(v);
                    setOpen(true);
                    if (!v.trim()) {
                        onChange('');
                        return;
                    }
                    if (commitIfExact(v)) {
                        setOpen(false);
                        return;
                    }
                    onChange('');
                }}
                onFocus={() => setOpen(true)}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                        setOpen(false);
                        return;
                    }
                    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
                        setOpen(true);
                        return;
                    }
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setHighlight((h) => Math.min(h + 1, Math.max(0, list.length - 1)));
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setHighlight((h) => Math.max(h - 1, 0));
                    } else if (e.key === 'Enter' && open && list[highlight]) {
                        e.preventDefault();
                        pick(list[highlight]);
                    }
                }}
            />
            {open && list.length > 0 && (
                <ul
                    id={listboxId}
                    role="listbox"
                    style={{
                        position: 'absolute',
                        zIndex: 200,
                        left: 0,
                        right: 0,
                        maxHeight: 240,
                        overflowY: 'auto',
                        margin: '4px 0 0',
                        padding: 0,
                        listStyle: 'none',
                        background: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: 8,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    }}
                >
                    {list.map((s, i) => (
                        <li
                            key={s}
                            role="option"
                            aria-selected={i === highlight}
                            style={{
                                padding: '10px 12px',
                                cursor: 'pointer',
                                background: i === highlight ? '#fdf6f6' : 'transparent',
                                fontSize: 14,
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                            onMouseEnter={() => setHighlight(i)}
                            onClick={() => pick(s)}
                        >
                            {s}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
