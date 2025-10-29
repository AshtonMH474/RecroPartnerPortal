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

export async function getServerSideProps({ params, req,res }) {
  const userToken = req.cookies.token; // your cookie name
  
  if (!userToken) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }
  const decoded = jwt.decode(userToken);

    // Check if expired
    if (!decoded || Date.now() >= decoded.exp * 1000) {
      console.log('Token expired');
      res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0), // immediately expire
        sameSite: "lax",
        path: "/",
      })
    );
      return {
        redirect: { destination: '/', permanent: false },
      };
    }

  const { client } = await import("../../tina/__generated__/databaseClient");
  if (params.slug?.[0].startsWith(".well-known")) {
    return {
      notFound: true,
    };
  }
  const filename = params.slug?.[0] + ".md";

  const [pageData, navData, footerData,paperData,sheetData,oppData] = await Promise.all([
    client.queries.page({ relativePath: filename }),
    client.queries.nav({ relativePath: "nav_authorized.md" }),
    client.queries.footer({ relativePath: "footer.md" }),
    client.queries.paperConnection({first: parseInt(process.env.LIMIT) || 50}),
    client.queries.sheetConnection({first: parseInt(process.env.LIMIT) || 50 }),
    client.queries.opportunitesConnection({first: parseInt(process.env.LIMIT) || 50 })
  ]);

  return {
    props: { res: pageData, nav: navData, footer: footerData, paper:paperData, sheets:sheetData, opp:oppData },
  };
}



function Slug({res,nav,footer,paper,sheets,opp}){
  
    const {data: pageData} = useTina(res)
    const {data: navContent} = useTina(nav)
    const {data:footerContent} = useTina(footer)
    const {data:paperContent} = useTina(paper)
    const {data:sheetContent} = useTina(sheets)
    const {data: oppContent} = useTina(opp)
    const [sidebarWidth, setSidebarWidth] = useState(200);
    const allPapers = paperContent.paperConnection.edges.map(e => e.node);
    const allSheets = sheetContent.sheetConnection.edges.map(e => e.node);
    const allOpps = oppContent.opportunitesConnection.edges.map(e => e.node);
    
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
                  return <Dashboard key={i} props={block} papers={newWhitePapers} sheets={newDataSheets}/>
        case 'PageBlocksOpportunites':
          return <Opportunites key={i} props={block} opportunites={allOpps}/>
        case 'PageBlocksActivity':
          return <Activity key={i} props={block}/>
        case 'PageBlocksPapers':
          return <Papers key={i} props={block} papers={allPapers}/>
        case 'PageBlocksSheets':
          return <Papers key={i} props={block} papers={allSheets}/>
        case 'PageBlocksAllOpps':
          return <AllOpps key={i} props={block} opps={allOpps}/>
        case 'PageBlocksMyOpps':
          return <MyOpps key={i} props={block}/>
      }
    })}
      <Footer res={footerContent.footer} sidebarWidth={sidebarWidth} />
      </div>
    </>
    );
}

export default Slug