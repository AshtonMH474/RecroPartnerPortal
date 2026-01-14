import { useAuth } from "@/context/auth";
import { useDownloads } from "@/context/downloads";
import { useEffect, useMemo, useState } from "react";
import IntroHeading from "./IntroHeading";
import { TabFilter } from "@/components/shared";
import Cards from "../Cards/Cards";
import Buttons from "./Buttons";
import { filterByInterests } from "@/lib/service_functions";

function Dashboard({ props, allPapers, allSheets, allStatements }) {
  const { user } = useAuth();
  const { downloads, loading: loadingRecent } = useDownloads();
  const [active, setActive] = useState(props?.filters?.[0]?.filter || "");
  const [buttons, setButtons] = useState(props?.filters?.[0]?.buttons || []);

  // ✅ Get recent downloads from context (first 8)
    const recent = useMemo(() => downloads.slice(0, 8), [downloads]);
// 1. Convert interests to Set for O(1) lookups instead of O(n)
    const interestSet = useMemo(
      () => new Set(user?.interests || []),
      [user?.interests]
    );

    // 2. Combine filter + sort + slice into single operation
    const papers = useMemo(() => filterByInterests(allPapers, interestSet), [allPapers, interestSet]);
    const sheets = useMemo(() => filterByInterests(allSheets, interestSet), [allSheets, interestSet]);
    const statements = useMemo(() => filterByInterests(allStatements, interestSet), [allStatements, interestSet]);


  // Set default tab only if no downloads
    useEffect(() => {
      if (downloads.length === 0 && user?.email) {
        setActive("papers");
      }
    }, [downloads.length, user?.email]);

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
    <div data-testid="dashboard-block" className="pb-20 min-h-screen">
      <div className="mt-20 flex flex-col px-4 md:px-12">
        <div>
          <IntroHeading props={props} user={user} />
          <TabFilter
            tabs={props?.filters || []}
            active={active}
            setActive={setActive}
            recent={recent}
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
