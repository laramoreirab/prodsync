"use client";

import { useEffect, useState, useRef } from "react";

export function useChartData(fetcher) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const result = await fetcherRef.current();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []); 

  return { data, loading, error };
}