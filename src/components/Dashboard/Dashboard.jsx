import { useAuth } from "@/context/auth";
import { useEffect, useMemo, useState, useCallback } from "react";
import IntroHeading from "./IntroHeading";
import Filters from "./Filters";
import Cards from "../Cards/Cards";
import Buttons from "./Buttons";

function Dashboard({ props, papers, sheets, statements }) {
  const { user } = useAuth();
  const [active, setActive] = useState(props?.filters?.[0]?.filter || "");
  const [buttons, setButtons] = useState(props?.filters?.[0]?.buttons || []);
  const [recent, setRecent] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  // ✅ Fetch downloads immediately (no setTimeout delay)
  useEffect(() => {
    if (!user?.email) return;

    let cancelled = false;

    const getDownloads = async () => {
      setLoadingRecent(true);
      try {
        const res = await fetch(
          `/api/userInfo/downloads?email=${encodeURIComponent(user.email)}`
        );
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        
        // ✅ Only update if component is still mounted
        if (!cancelled) {
          setRecent(data.downloads?.slice(0, 8) || []);
          
          // Set default tab only if no downloads
          if (data.downloads?.length === 0) {
            setActive("papers");
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch downloads:", err);
          setRecent([]); // Set empty array on error
        }
      } finally {
        if (!cancelled) {
          setLoadingRecent(false);
        }
      }
    };

    getDownloads();

    // ✅ Cleanup to prevent state updates after unmount
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  // ✅ Memoize cards computation (only recalculate when dependencies change)
  const cards = useMemo(() => {
    switch (active) {
      case "papers":
        return papers || [];
      case "recent":
        return recent || [];
      case "sheets":
        return sheets || [];
      case "statements":
        return statements || [];
      default:
        return [];
    }
  }, [active, papers, sheets, statements, recent]);

  // ✅ Memoize buttons computation
  const buttonsMemo = useMemo(() => {
    const filter = props?.filters?.find((f) => f.filter === active);
    return filter?.buttons || [];
  }, [active, props?.filters]);

  // ✅ Update buttons state only when memoized value changes
  useEffect(() => {
    setButtons(buttonsMemo);
  }, [buttonsMemo]);

  // Placeholder for auth loading
  if (!user) {
    return <div style={{ minHeight: "100vh" }}></div>;
  }

  return (
    <div className="pb-20 min-h-screen">
      <div className="mt-20 flex flex-col pl-16">
        <div>
          <IntroHeading props={props} user={user} />
          <Filters
            recent={recent}
            active={active}
            setActive={setActive}
            props={props}
            user={user}
          />
        </div>

        {/* ✅ Show loading state for recent tab */}
        {active === "recent" && loadingRecent ? (
          <div className="flex justify-center items-center py-20 pr-16">
            <div className="text-[#C2C2BC]">Loading recent downloads...</div>
          </div>
        ) : (
          <Cards cards={cards} />
        )}
        <Buttons buttons={buttons} />
      </div>
    </div>
  );
}

export default Dashboard;
