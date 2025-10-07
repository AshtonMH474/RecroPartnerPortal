import Landing from "@/components/Landing";
import Nav from "@/components/Nav/Nav";
import { useTina } from "tinacms/dist/react";



export async function getStaticProps() {
  const { client } = await import("../../tina/__generated__/databaseClient");
  console.log(client.queries)
  // Run TinaCMS queries in parallel
  const [pageData,navData] = await Promise.all([
    client.queries.page({ relativePath: "home.md" }),
    client.queries.nav({relativePath:'nav.md'})
  ]);
  

  return {
    props: {
      res: pageData,
      nav:navData
    },
  };
}

export default function Home({res,nav}) {
  const {data: pageData} = useTina(res)
  const {data: navContent} = useTina(nav)
  

  return (
    <>
    <Nav {...navContent.nav}/>
    {pageData.page.blocks?.map((block,i) => {
      switch(block?.__typename){
        case "PageBlocksLanding":
                  return <Landing key={i}  {...block}/>;
      }
    })}
    </>
  );
}
