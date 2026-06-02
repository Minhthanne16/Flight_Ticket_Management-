import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Generic API hook with auto-refresh
 * @param {Function} apiFn - axios service function to call
 * @param {any[]} deps - extra dependencies that trigger re-fetch
 * @param {object} options - { pollingInterval (ms, default 30000), refetchOnFocus (default true) }
 * @returns {{ data, loading, error, refetch }}
 */
export function useApi(apiFn, deps = [], options = {}) {
  const { pollingInterval = 30000, refetchOnFocus = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  const fetch = useCallback(async (silent = false) => {
    if (!silent) { setLoading(true); setError(null); }
    try {
      const res = await apiFn();
      // Service có thể trả về:
      //  1) Nguyên response axios kèm ApiResponse wrapper: res.data.data
      //  2) Nguyên response axios với payload trực tiếp: res.data
      //  3) Dữ liệu đã bóc tách sẵn (mảng/đối tượng): res
      setData(res?.data?.data ?? res?.data ?? res);
      if (!silent) setError(null);
    } catch (err) {
      if (!silent) setError(err.response?.data?.message || err.message || 'Lỗi kết nối máy chủ');
    } finally {
      if (!silent) setLoading(false);
      hasFetched.current = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // Initial fetch
  useEffect(() => { fetch(false); }, [fetch]);

  // Auto-refresh: polling + refetch on window focus
  useEffect(() => {
    if (!hasFetched.current) return;

    const silentRefetch = () => fetch(true);

    // Poll every pollingInterval ms
    const interval = pollingInterval > 0
      ? setInterval(silentRefetch, pollingInterval)
      : null;

    // Refetch when tab regains focus
    if (refetchOnFocus) {
      window.addEventListener('focus', silentRefetch);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (refetchOnFocus) window.removeEventListener('focus', silentRefetch);
    };
  }, [fetch, pollingInterval, refetchOnFocus]);

  return { data, loading, error, refetch: () => fetch(false) };
}
