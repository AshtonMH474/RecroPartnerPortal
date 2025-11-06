import { useAuth } from "@/context/auth";
import { useEffect, useMemo, useState } from "react";
import IntroHeading from "./IntroHeading";
import Filters from "./Filters";
import Cards from "../Cards/Cards";
import Buttons from "./Buttons";

function Dashboard({ props, papers, sheets, statements }) {
  const { user } = useAuth();
  const [active, setActive] = useState(props?.filters?.[0]?.filter || "");
  const [buttons, setButtons] = useState(props?.filters?.[0]?.buttons || []);
  const [recent, setRecent] = useState([]);

  // Fetch downloads once user is available
  useEffect(() => {
    if (!user?.email) return;

    const getDownloads = async () => {
      try {
        const res = await fetch(
          `/api/userInfo/downloads?email=${encodeURIComponent(user.email)}`
        );
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setRecent(data.downloads.slice(0, 8));

        // Set default tab only if no downloads
        if (data.downloads.length === 0) {
          setActive("papers");
        }
      } catch (err) {
        console.error("Failed to fetch downloads:", err);
      }
    };

    // Run after paint for smoother UX
    setTimeout(getDownloads, 0);
  }, [user?.email]);

  // Compute cards to show based on active filter
  const cards = useMemo(() => {
    switch (active) {
      case "papers":
        return papers;
      case "recent":
        return recent;
      case "sheets":
        return sheets;
      case "statements":
        return statements;
      default:
        return [];
    }
  }, [active, papers, sheets, statements, recent]);

  // Compute buttons for active filter
  useEffect(() => {
    const filter = props?.filters?.find((f) => f.filter === active);
    setButtons(filter?.buttons || []);
  }, [active, props?.filters]);

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

        <Cards cards={cards} />
        <Buttons buttons={buttons} />
      </div>
    </div>
  );
}

export default Dashboard;
