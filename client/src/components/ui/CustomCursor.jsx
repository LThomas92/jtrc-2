import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
    };

    let raf;
    const animate = () => {
      const dx = mouseRef.current.x - ringPosRef.current.x;
      const dy = mouseRef.current.y - ringPosRef.current.y;
      ringPosRef.current.x += dx * 0.12;
      ringPosRef.current.y += dy * 0.12;
      ring.style.left = `${ringPosRef.current.x}px`;
      ring.style.top = `${ringPosRef.current.y}px`;
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onEnter = () => {
      dot.style.width = '18px';
      dot.style.height = '18px';
      ring.style.width = '58px';
      ring.style.height = '58px';
      ring.style.opacity = '0.15';
    };
    const onLeave = () => {
      dot.style.width = '10px';
      dot.style.height = '10px';
      ring.style.width = '40px';
      ring.style.height = '40px';
      ring.style.opacity = '0.4';
    };

    const targets = document.querySelectorAll('a, button, [data-cursor="pointer"]');
    targets.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    document.addEventListener('mousemove', onMove);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor" aria-hidden="true" />
      <div ref={ringRef} className="cursor__ring" aria-hidden="true" />
    </>
  );
}
