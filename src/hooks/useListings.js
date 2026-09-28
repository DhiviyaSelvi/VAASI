import { useState, useEffect, useCallback } from 'react';
import { getListings } from '../services/listingsService';

/**
 * Custom React hook for fetching and consuming book listings.
 * Includes support for refetching and temporary error testing in DEV mode.
 */
export function useListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forceError, setForceError] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (forceError) {
        throw new Error('Simulated network error while loading book listings.');
      }
      const data = await getListings();
      setListings(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch book listings');
    } finally {
      setLoading(false);
    }
  }, [forceError]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const toggleForceError = () => {
    setForceError((prev) => !prev);
  };

  return { listings, loading, error, refetch: fetchListings, toggleForceError, isForcedError: forceError };
}
