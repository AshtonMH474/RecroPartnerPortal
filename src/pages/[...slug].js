import Dashboard from "@/components/Dashboard/Dashboard";
import Footer from "@/components/Footer";
import Landing from "@/components/Landing";
import Nav from "@/components/Nav/Nav";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useState } from "react";
import { useTina } from "tinacms/dist/react";
import jwt from 'jsonwebtoken';
import cookie from "cookie";
import Opportunites from "@/components/Opportunites/Opportunites";
import Activity from "@/components/Activity/Activity";
import Papers from "@/components/Papers/Papers";
import AllOpps from "@/components/AllOpps.jsx/AllOpps";
import MyOpps from "@/components/MyOpps/MyOpps";
import MyOpportunites from "@/components/MyOpps/MyOpportunites";


export async function getServerSideProps({ params, req, res }) {
  try {
    const cookies = req.cookies;
    let accessToken = cookies.token;
    const refreshToken = cookies.refresh_token;

    let decoded;

    // ✅ 1. Validate Access Token
    if (accessToken) {
      try {
        decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        console.log("✅ Access token valid");
      } catch {
        accessToken = null; // token expired or invalid
      }
    }

    // ✅ 2. Refresh Access Token if Expired
    if (!accessToken && refreshToken) {
      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Issue new access token
        const newAccessToken = jwt.sign(
          { id: decodedRefresh.id,email: decodedRefresh.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.setHeader(
          "Set-Cookie",
          cookie.serialize("token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60, // 1 hour
            path: "/",
          })
        );

        decoded = jwt.decode(newAccessToken);
        accessToken = newAccessToken;
      } catch (err) {
        console.log("❌ Refresh token invalid or expired:", err.message);
      }
    }

    // ✅ 3. Redirect if authentication fails
    if (!accessToken || !decoded) {
      return {
        redirect: { destination: "/", permanent: false },
      };
    }

    // ✅ 4. Handle TinaCMS content safely
    const { client } = await import("../../tina/__generated__/databaseClient");

    if (params.slug?.[0]?.startsWith(".well-known")) {
      return { notFound: true };
    }

    const filename = `${params.slug?.[0]}.md`;

    const [pageData, navData, footerData, paperData, sheetData, oppData,statementsData] = await Promise.all([
      client.queries.page({ relativePath: filename }),
      client.queries.nav({ relativePath: "nav_authorized.md" }),
      client.queries.footer({ relativePath: "footer.md" }),
      client.queries.paperConnection({ first: parseInt(process.env.LIMIT) || 50 }),
      client.queries.sheetConnection({ first: parseInt(process.env.LIMIT) || 50 }),
      client.queries.opportunitesConnection({ first: parseInt(process.env.LIMIT) || 50 }),
      client.queries.statementsConnection({ first: parseInt(process.env.LIMIT) || 50 }),
    ]);

    // ✅ 5. Return data to page
    return {
      props: {
        res: pageData,
        nav: navData,
        footer: footerData,
        paper: paperData,
        sheets: sheetData,
        opp: oppData,
        statements:statementsData
      },
    };
  } catch (err) {
    console.error("❌ Server error:", err);
    return {
      redirect: { destination: "/", permanent: false },
    };
  }
}



function Slug({res,nav,footer,paper,sheets,opp,statements}){
  
    const {data: pageData} = useTina(res)
    const {data: navContent} = useTina(nav)
    const {data:footerContent} = useTina(footer)
    const {data:paperContent} = useTina(paper)
    const {data:sheetContent} = useTina(sheets)
    const {data: oppContent} = useTina(opp)
    const {data:statementsContent} = useTina(statements)
    const [sidebarWidth, setSidebarWidth] = useState(200);
    const allPapers = paperContent.paperConnection.edges.map(e => e.node);
    const allSheets = sheetContent.sheetConnection.edges.map(e => e.node);
    const allOpps = oppContent.opportunitesConnection.edges.map(e => e.node);
    const allStatements = statementsContent.statementsConnection.edges.map(e => e.node);
    const newWhitePapers = allPapers
    .sort((a, b) => {
    const dateA = new Date(a.lastUpdated);
    const dateB = new Date(b.lastUpdated);
    return dateB - dateA; // most recent first
  })
  .slice(0, 8); 

  const newDataSheets = allSheets
    .sort((a, b) => {
    const dateA = new Date(a.lastUpdated);
    const dateB = new Date(b.lastUpdated);
    return dateB - dateA; // most recent first
  })
  .slice(0, 8);

  const newStatements = allStatements
    .sort((a, b) => {
    const dateA = new Date(a.lastUpdated);
    const dateB = new Date(b.lastUpdated);
    return dateB - dateA; // most recent first
  })
  .slice(0, 8);


      console.log(pageData)
    return (
    <>
    <Nav {...navContent.nav}/>
    <Sidebar res={navContent.nav} onWidthChange={setSidebarWidth}/>
    <div
        className="transition-all duration-500 ease-in-out "
        style={{
          marginLeft: `${sidebarWidth}px`,
        }}
      >
      
    {pageData.page.blocks?.map((block,i) => {
      
      switch(block?.__typename){
        case "PageBlocksLanding":
                  return <Landing key={i}  {...block}/>;
        case "PageBlocksDashboard":
                  return <Dashboard key={i} props={block} papers={newWhitePapers} sheets={newDataSheets} statements={newStatements}/>
        case 'PageBlocksOpportunites':
          return <Opportunites key={i} props={block} opportunites={allOpps}/>
        case 'PageBlocksActivity':
          return <Activity key={i} props={block}/>
        case 'PageBlocksPapers':
          return <Papers key={i} props={block} papers={allPapers}/>
        case 'PageBlocksSheets':
          return <Papers key={i} props={block} papers={allSheets}/>
        case "PageBlocksStatements":
            return <Papers key={i} props={block} papers={allStatements}/>
        case 'PageBlocksAllOpps':
          return <AllOpps key={i} props={block} opps={allOpps}/>
        case 'PageBlocksMyOpps':
          // return <MyOpps key={i} props={block}/>
          return <MyOpportunites key={i} props={block}/>
      }
    })}
      <Footer res={footerContent.footer} sidebarWidth={sidebarWidth} />
      </div>
    </>
    );
}

export default Slug