import { useState, useEffect, useCallback, useRef } from 'react';
import { searchAPI } from '@lib/api';

export function useSearch() {
  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open,    setOpen]    = useState(false);
  const [cursor,  setCursor]  = useState(-1);    // keyboard nav index

  const debounceRef = useRef(null);
  const abortRef    = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      setOpen(false);
      return;
    }

    setLoading(true);
    setOpen(true);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      // Cancel any in-flight request
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      try {
        const res = await searchAPI.query(query.trim());
        setResults(res.data.results || []);
        setCursor(-1);
      } catch {
        // silently ignore aborted requests
      } finally {
        setLoading(false);
      }
    }, 240);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
    setOpen(false);
    setCursor(-1);
  }, []);

  // Keyboard nav
  const onKeyDown = useCallback((e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, -1));
    } else if (e.key === 'Escape') {
      clear();
    }
  }, [open, results.length, clear]);

  return {
    query, setQuery,
    results,
    loading,
    open, setOpen,
    cursor,
    onKeyDown,
    clear,
  };
}
