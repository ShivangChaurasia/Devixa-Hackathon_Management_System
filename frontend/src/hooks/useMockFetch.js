import { useState, useEffect } from 'react';

export default function useMockFetch(data, delay = 1000) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(() => {
      if (isMounted) {
        if (data === undefined || data === null) {
          setError(new Error('Data not found'));
        } else {
          setResult(data);
        }
        setLoading(false);
      }
    }, delay);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [data, delay]);

  return { data: result, loading, error };
}
