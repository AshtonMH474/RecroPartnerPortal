import Dashboard from "@/components/Dashboard/Dashboard";
import Footer from "@/components/Footer";
import Landing from "@/components/Landing";
import Nav from "@/components/Nav/Nav";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useState } from "react";
import { useTina } from "tinacms/dist/react";
import jwt from 'jsonwebtoken';
import cookie from "cookie";

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
  const filename = params.slug?.[0] + ".md";

  const [pageData, navData, footerData,paperData] = await Promise.all([
    client.queries.page({ relativePath: filename }),
    client.queries.nav({ relativePath: "nav_authorized.md" }),
    client.queries.footer({ relativePath: "footer.md" }),
    client.queries.paperConnection()
  ]);

  return {
    props: { res: pageData, nav: navData, footer: footerData, paper:paperData },
  };
}



function Slug({res,nav,footer,paper}){
  
    const {data: pageData} = useTina(res)
    const {data: navContent} = useTina(nav)
    const {data:footerContent} = useTina(footer)
    const {data:paperContent} = useTina(paper)
    const [sidebarWidth, setSidebarWidth] = useState(200);
    
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
                  return <Dashboard key={i} props={block} papers={paperContent}/>
      }
    })}

      <Footer res={footerContent.footer} sidebarWidth={sidebarWidth}/>
      </div>
    </>
    );
}

export default Slug