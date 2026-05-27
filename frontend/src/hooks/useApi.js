import { useState, useEffect, useCallback } from 'react';

/**
 * Generic API hook
 * @param {Function} apiFn - axios service function to call
 * @param {any[]} deps - extra dependencies that trigger re-fetch
 * @returns {{ data, loading, error, refetch }}
 */
export function useApi(apiFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn();
      // Handle both raw arrays and ApiResponse wrappers { data: [...] }
      setData(res.data?.data ?? res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
