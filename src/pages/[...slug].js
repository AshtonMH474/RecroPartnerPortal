import Dashboard from "@/components/Dashboard/Dashboard";
import Footer from "@/components/Footer";
import Landing from "@/components/Landing";
import Nav from "@/components/Nav/Nav";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useState } from "react";
import { useTina } from "tinacms/dist/react";

export async function getServerSideProps({ params, req }) {
  const userToken = req.cookies.token; // your cookie name

  if (!userToken) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  const { client } = await import("../../tina/__generated__/databaseClient");
  const filename = params.slug?.[0] + ".md";

  const [pageData, navData, footerData] = await Promise.all([
    client.queries.page({ relativePath: filename }),
    client.queries.nav({ relativePath: "nav_authorized.md" }),
    client.queries.footer({ relativePath: "footer.md" }),
  ]);

  return {
    props: { res: pageData, nav: navData, footer: footerData },
  };
}



function Slug({res,nav,footer}){
    const {data: pageData} = useTina(res)
    const {data: navContent} = useTina(nav)
    const {data:footerContent} = useTina(footer)
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
                  return <Dashboard key={i} {...block}/>
      }
    })}

      <Footer res={footerContent.footer} sidebarWidth={sidebarWidth}/>
      </div>
    </>
    );
}

export default Slug