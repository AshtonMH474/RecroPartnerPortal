import Landing from "@/components/Landing";
import { useTina } from "tinacms/dist/react";


export async function getStaticProps() {
  const { client } = await import("../../tina/__generated__/databaseClient");

  // Run TinaCMS queries in parallel
  const [pageData] = await Promise.all([
    client.queries.page({ relativePath: "home.md" }),
  ]);


  return {
    props: {
      res: pageData,
    },
  };
}

export default function Home({res}) {
  const {data} = useTina(res)
  return (
    <>
    {data.page.blocks?.map((block,i) => {
      switch(block?.__typename){
        case "PageBlocksLanding":
                  return <Landing key={i}  {...block}/>;
      }
    })}
    </>
  );
}
