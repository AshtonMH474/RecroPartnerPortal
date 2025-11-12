import { activityBlock } from "./blocks/activity";
import { allDealsBlock } from "./blocks/allDeals";
import { dashboardBlock } from "./blocks/dashboard";
import { landingBlock } from "./blocks/landing";
import { myDeals } from "./blocks/myDeals";
import { opportunitesBlock } from "./blocks/opportunites";
import { papersBlock } from "./blocks/papers";
import { sheetsBlock } from "./blocks/sheets";
import { statementsBlock } from "./blocks/statements";

const pages = {
  name: "page",
  label: "Page",
  path: "content/pages",
  format: "md",
  ui: {
    router: (props) => {
  // Remove the file extension
  const slug = props.document._sys.relativePath.replace(/\.md$/, "");

  // If it's `home.md`, route to root
  if (slug === "home") return "/";

  // Otherwise, convert folder paths like `careers/values` → `/careers/values`
  return `/${slug}`;
}
  },
  fields: [
    {
      name: "title",
      type: "string",
    },
    {
      name: "blocks",
      label: "Blocks",
      type: "object",
      list: true,
      templates: [landingBlock,dashboardBlock,opportunitesBlock,activityBlock,papersBlock,sheetsBlock,allDealsBlock,myDeals,statementsBlock],
    },
    
  ],
  
};

export default pages;