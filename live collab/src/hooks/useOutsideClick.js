import { useEffect } from 'react';

export default function useOutsideClick(ref, onOutsideClick) {

  useEffect(() => {
    function handleClick(e) {
      if (ref.current &&  !ref.current.contains(e.target)) {
        onOutsideClick(e);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, onOutsideClick]);
}
