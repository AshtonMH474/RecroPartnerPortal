import Footer from "@/components/Footer";
import Landing from "@/components/Landing";
import Nav from "@/components/Nav/Nav";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useState } from "react";
import { useTina } from "tinacms/dist/react";

export async function getStaticPaths() {
  const { client } = await import("../../tina/__generated__/databaseClient");
  const pages = await client.queries.pageConnection();

  const paths = pages?.data?.pageConnection?.edges.map(({ node }) => ({
    params: { slug: [node._sys.filename] }, // array, works with [...slug].js
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({params}) {
  const { client } = await import("../../tina/__generated__/databaseClient");
  const filename = params.slug[0] + ".md";
  // Run TinaCMS queries in parallel
  const [pageData,navData,footerData] = await Promise.all([
    client.queries.page({ relativePath: filename }),
    client.queries.nav({relativePath:'nav_authorized.md'}),
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
      }
    })}

      <Footer res={footerContent.footer}/>
      </div>
    </>
    );
}

export default Slug