import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth";

const DownloadsContext = createContext();

export function DownloadsProvider({ children }) {
  const { user } = useAuth();
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.email) {
      setDownloads([]);
      return;
    }

    let cancelled = false;

    const fetchDownloads = async () => {
      setLoading(true);
      setError(null);
      try {
        // ✅ Default limit of 100 (enough for Dashboard + Activity filtering)
        // Dashboard only shows 8, Activity can filter/search within this set
        const res = await fetch(
          `/api/userInfo/downloads?limit=100`,
          {
            credentials: 'include' // Send cookies for authentication
          }
        );
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();

        if (!cancelled) {
          setDownloads(data.downloads || []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch downloads:", err);
          setError(err.message);
          setDownloads([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDownloads();

    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  const refreshDownloads = async () => {
    if (!user?.email) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/userInfo/downloads?limit=100`,
        {
          credentials: 'include' // Send cookies for authentication
        }
      );
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();

      setDownloads(data.downloads || []);

    } catch (err) {
      console.error("Failed to refresh downloads:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DownloadsContext.Provider value={{ downloads, loading, error, refreshDownloads }}>
      {children}
    </DownloadsContext.Provider>
  );
}

export const useDownloads = () => useContext(DownloadsContext);
