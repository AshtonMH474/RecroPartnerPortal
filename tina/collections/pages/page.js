import { landingBlock } from "./blocks/landing";

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
      templates: [landingBlock],
    },
  ],
};

export default pages;