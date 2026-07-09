import { useState, useCallback } from 'react';

const MIN_ZOOM = 25;
const MAX_ZOOM = 200;
const STEP = 10;

export default function useZoomPan(initialZoom = 100) {
  const [zoom, setZoom] = useState(initialZoom);

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(MAX_ZOOM, z + STEP));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(MIN_ZOOM, z - STEP));
  }, []);

  const resetZoom = useCallback(() => setZoom(100), []);

  return { zoom, zoomIn, zoomOut, resetZoom, setZoom };
}
