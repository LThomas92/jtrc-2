import { useEffect, useRef, useState } from 'react';

// Detect touch/mobile — skip animation entirely on these devices.
// IntersectionObserver fires inconsistently on Firefox mobile and
// the translateY initial state can leave content invisible.
const isTouchDevice =
  typeof window !== 'undefined' &&
  (window.matchMedia('(hover: none)').matches ||
   window.matchMedia('(pointer: coarse)').matches);

export default function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  delay = 0,
  threshold = 0.08,
  ...rest
}) {
  const ref = useRef(null);
  // On touch devices start visible — no animation
  const [visible, setVisible] = useState(isTouchDevice);

  useEffect(() => {
    // Skip observer entirely on touch devices
    if (isTouchDevice) return;

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          obs.unobserve(el);
        }
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [delay, threshold]);

  const combined = `reveal ${visible ? 'is-visible' : ''} ${className}`.trim();

  return (
    <Tag ref={ref} className={combined} {...rest}>
      {children}
    </Tag>
  );
}
