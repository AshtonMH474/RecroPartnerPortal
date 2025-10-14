import Footer from "@/components/Footer";
import Landing from "@/components/Landing";
import Nav from "@/components/Nav/Nav";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useState } from "react";
import { useTina } from "tinacms/dist/react";

// ✅ Server-side auth redirect
export async function getServerSideProps(context) {
  const { req } = context;
  const userToken = req.cookies.token; // change if you use a different cookie name

  // If logged in → go to dashboard
  if (userToken) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  // If not logged in → show home content
  const { client } = await import("../../tina/__generated__/databaseClient");
  const [pageData, navData, footerData] = await Promise.all([
    client.queries.page({ relativePath: "home.md" }),
    client.queries.nav({ relativePath: "nav.md" }),
    client.queries.footer({ relativePath: "footer.md" }),
  ]);

  return {
    props: {
      res: pageData,
      nav: navData,
      footer: footerData,
    },
  };
}

export default function Home({ res, nav, footer }) {
  const { data: pageData } = useTina(res);
  const { data: navContent } = useTina(nav);
  const { data: footerContent } = useTina(footer);
  const [sidebarWidth, setSidebarWidth] = useState(200);

  return (
    <>
      <Nav {...navContent.nav} />
      <Sidebar res={navContent.nav} onWidthChange={setSidebarWidth} />
      <div
        className="transition-all duration-500 ease-in-out"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        {pageData.page.blocks?.map((block, i) => {
          switch (block?.__typename) {
            case "PageBlocksLanding":
              return <Landing key={i} {...block} />;
            default:
              return null;
          }
        })}
        <Footer res={footerContent.footer} />
      </div>
    </>
  );
}
