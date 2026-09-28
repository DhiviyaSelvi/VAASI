import { useState, useEffect } from 'react';
import { getListings } from '../services/listingsService';

/**
 * Custom React hook for fetching and consuming book listings.
 */
export function useListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const data = await getListings();
        if (isMounted) {
          setListings(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch listings');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { listings, loading, error };
}
