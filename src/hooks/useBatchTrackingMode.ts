import { useEffect, useState } from 'react';

const STORAGE_KEY = 'batchTrackingMode';

export function useBatchTrackingMode() {
  const [enabled, setEnabled] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(enabled));
  }, [enabled]);

  return [enabled, setEnabled] as const;
}
