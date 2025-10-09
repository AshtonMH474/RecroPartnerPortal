import Footer from "@/components/Footer";
import Landing from "@/components/Landing";
import Nav from "@/components/Nav/Nav";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useState } from "react";
import { useTina } from "tinacms/dist/react";



export async function getStaticProps() {
  const { client } = await import("../../tina/__generated__/databaseClient");
  
  // Run TinaCMS queries in parallel
  const [pageData,navData,footerData] = await Promise.all([
    client.queries.page({ relativePath: "home.md" }),
    client.queries.nav({relativePath:'nav.md'}),
    client.queries.footer({relativePath:'footer.md'})
  ]);
  

  return {
    props: {
      res: pageData,
      nav:navData,
      footer:footerData
    },
  };
}

export default function Home({res,nav,footer}) {
  const {data: pageData} = useTina(res)
  const {data: navContent} = useTina(nav)
  const {data:footerContent} = useTina(footer)
  const [sidebarWidth, setSidebarWidth] = useState(200);

  return (
    <>
    <Nav {...navContent.nav}/>
    <Sidebar res={navContent.nav} onWidthChange={setSidebarWidth}/>
    <div
        className="transition-all duration-500 ease-in-out"
        style={{
          marginLeft: `${sidebarWidth}px`,
        }}
      >
    {pageData.page.blocks?.map((block,i) => {
      switch(block?.__typename){
        case "PageBlocksLanding":
                  return <Landing key={i}  {...block}/>;
      }
    })}
    <Footer res={footerContent.footer}/>
    </div>
    </>
  );
}
