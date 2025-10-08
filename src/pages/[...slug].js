import Landing from "@/components/Landing";
import Nav from "@/components/Nav/Nav";
import Sidebar from "@/components/Sidebar/Sidebar";
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
  const [pageData,navData] = await Promise.all([
    client.queries.page({ relativePath: filename }),
    client.queries.nav({relativePath:'nav_authorized.md'})
  ]);
  

  return {
    props: {
      res: pageData,
      nav:navData
    },
  };
}



function Slug({res,nav}){
    const {data: pageData} = useTina(res)
    const {data: navContent} = useTina(nav)

    return (
    <>
    <Nav {...navContent.nav}/>
    <Sidebar {...navContent.nav}/>
    {pageData.page.blocks?.map((block,i) => {
      switch(block?.__typename){
        case "PageBlocksLanding":
                  return <Landing key={i}  {...block}/>;
      }
    })}
    </>
    );
}

export default Slug