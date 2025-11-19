import { lazy, Suspense } from 'react';
const Dashboard = lazy(() => import('@/components/Dashboard/Dashboard'));
const Activity = lazy(() => import('@/components/Activity/Activity'));
const Materials = lazy(() => import('@/components/Materials/Materials'));
const AllDeals = lazy(() => import('@/components/Deals/AllDeals'));
const MyDeals = lazy(() => import('@/components/Deals/MyDeals'));
const Landing = lazy(() => import('@/components/Landing'));
import Footer from "@/components/Footer";
import Nav from "@/components/Nav/Nav";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useState, useMemo, useEffect, useRef } from "react";
import { useTina } from "tinacms/dist/react";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { useAuth } from "@/context/auth";

// ✅ Cache Tina client globally (persists across requests)
let cachedTinaClient = null;

async function getTinaClient() {
  if (cachedTinaClient) return cachedTinaClient;
  const { client } = await import("../../tina/__generated__/databaseClient");
  cachedTinaClient = client;
  return client;
}

/* ============================
   ⚡️ SERVER SIDE OPTIMIZATION
   ============================ */
export async function getServerSideProps({ params, req, res }) {
  try {
    const cookies = req.cookies || {};
    let accessToken = cookies.token;
    const refreshToken = cookies.refresh_token;

    let decoded;

    // ✅ 1. Verify Access Token
    if (accessToken) {
      try {
        decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      } catch {
        accessToken = null; // expired
      }
    }

    // ✅ 2. Try Refresh Token (no DB call needed)
    if (!accessToken && refreshToken) {
      try {
        const decodedRefresh = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET
        );

        const newAccessToken = jwt.sign(
          { id: decodedRefresh.id, email: decodedRefresh.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // Set refreshed access token
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 3600,
            path: "/",
          })
        );

        decoded = jwt.decode(newAccessToken);
        accessToken = newAccessToken;
      } catch {
        console.warn("⚠️ Refresh token invalid or expired");
      }
    }

    // ✅ 3. Redirect if still unauthenticated
    if (!accessToken || !decoded) {
      return { redirect: { destination: "/", permanent: false } };
    }

    // ✅ 4. Use cached Tina client (faster)
    const client = await getTinaClient();

    // ✅ 5. Handle non-content requests early
    if (params.slug?.[0]?.startsWith(".well-known")) {
      return { notFound: true };
    }

    const filename = `${params.slug?.[0]}.md`;

    // ✅ 6. Batch Tina queries concurrently
    const limit = parseInt(process.env.LIMIT || "50", 10);

    const [pageData, navData, footerData, paperData, sheetData, statementsData] =
      await Promise.all([
        client.queries.page({ relativePath: filename }),
        client.queries.nav({ relativePath: "nav_authorized.md" }),
        client.queries.footer({ relativePath: "footer.md" }),
        client.queries.paperConnection({ first: limit }),
        client.queries.sheetConnection({ first: limit }),
        client.queries.statementsConnection({ first: limit }),
      ]);

    // ✅ 7. Set cache headers for better performance
    // Cache for 60 seconds, revalidate in background
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );

    // ✅ 8. Send lean props
    return {
      props: {
        res: pageData,
        nav: navData,
        footer: footerData,
        paper: paperData,
        sheets: sheetData,
        statements: statementsData,
      },
    };
  } catch (err) {
    console.error("❌ getServerSideProps error:", err);
    return { redirect: { destination: "/", permanent: false } };
  }
}

/* ============================
   ⚡️ CLIENT RENDER OPTIMIZATION
   ============================ */
function Slug({ res, nav, footer, paper, sheets, statements }) {
  // Tina hooks
  const { data: pageData } = useTina(res);
  const { data: navContent } = useTina(nav);
  const { data: footerContent } = useTina(footer);
  const { data: paperContent } = useTina(paper);
  const { data: sheetContent } = useTina(sheets);
  const { data: statementsContent } = useTina(statements);

  const [sidebarWidth, setSidebarWidth] = useState(200);
  const {user,openModal} = useAuth()
  const hasCheckedInterests = useRef(false);
  // ✅ Open Edit modal if user has no interests
  useEffect(() => {
    if (user !== 'loading' && user && !hasCheckedInterests.current) {
      const hasNoInterests = !user.interests || 
        (Array.isArray(user.interests) && user.interests.length === 0);
      
      if (hasNoInterests) {
        hasCheckedInterests.current = true;
        openModal('Edit');
      }
    }
  }, [user, openModal]);
  

  // ✅ Memoize derived arrays (prevents re-sorting on every render)
  const allPapers = useMemo(
    () => paperContent.paperConnection.edges.map((e) => e.node),
    [paperContent]
  );
  const allSheets = useMemo(
    () => sheetContent.sheetConnection.edges.map((e) => e.node),
    [sheetContent]
  );
  const allStatements = useMemo(
    () => statementsContent.statementsConnection.edges.map((e) => e.node),
    [statementsContent]
  );


  

  /* ============================
     🚀 FAST, STABLE RENDER PATH
     ============================ */

  return (
    <>
      <Nav {...navContent.nav} />
      <Sidebar res={navContent.nav} onWidthChange={setSidebarWidth} />

      <main
        className="transition-all duration-500 ease-in-out"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-lg">Loading...</div></div>}>
          {pageData.page.blocks?.map((block, i) => {
            switch (block?.__typename) {
              case "PageBlocksLanding":
                return <Landing key={i} {...block} />;
              case "PageBlocksDashboard":
                return (
                  <Dashboard
                    key={i}
                    props={block}
                    allPapers={allPapers || []}
                    allSheets={allSheets || []}
                    allStatements={allStatements || []}
                  />
                );
              case "PageBlocksActivity":
                return <Activity key={i} props={block} />;
              case "PageBlocksPapers":
                return <Materials key={i} props={block} materials={allPapers} />;
              case "PageBlocksSheets":
                return <Materials key={i} props={block} materials={allSheets} />;
              case "PageBlocksStatements":
                return <Materials key={i} props={block} materials={allStatements} />;
              case "PageBlocksAllDeals":
                return <AllDeals key={i} props={block} />;
              case "PageBlocksMyDeals":
                return <MyDeals key={i} props={block} />;
              default:
                return null;
            }
          })}
        </Suspense>
        <Footer res={footerContent.footer} sidebarWidth={sidebarWidth} />
      </main>
    </>
  );
}

export default Slug;