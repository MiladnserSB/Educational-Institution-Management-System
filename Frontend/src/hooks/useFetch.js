import { useCallback, useEffect, useRef, useState } from "react";

const EMPTY = Object.freeze([]);

/**
 * Generic data-fetching hook.
 *
 * const { data, loading, error, reload } = useFetch(() => adminApi.users.list(), []);
 *
 * - `data` defaults to a stable empty array so list rendering and effects
 *   never need null checks (and never re-trigger on reference changes).
 * - `reload()` refetches after mutations (create/update/delete).
 * - The fetcher is read through a ref, so inline functions are safe.
 */
export default function useFetch(fetcher, deps = []) {
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();
    setLoading(true);
    setError("");

    Promise.resolve()
      .then(() => fetcherRef.current(controller.signal))
      .then((result) => {
        if (!alive) return;
        setData(result);
        setError("");
      })
      .catch((err) => {
        if (!alive || controller.signal.aborted) return;
        setError(err?.message || "حدث خطأ غير متوقع.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  const rows = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
      ? data.items
      : EMPTY;

  return { data: rows, single: data, loading, error, reload };
}
