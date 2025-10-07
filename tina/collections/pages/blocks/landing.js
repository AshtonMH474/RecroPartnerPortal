export const landingBlock = {
  name: "landing",
  label: "Landing",
  fields: [
    {
      name: "heading",
      label:'Heading',
      type: "rich-text",
    },
    {
      name:'width',
      label:'Width(percentage) for Heading for Desktop',
      type:'number'
    },
    {
      name: "buttons",
      label: "Buttons",
      type: "object",
      list: true,
      fields: [
        {
          type: "string",
          name: "link",
        },
        {
          type: "string",
          name: "label",
        },
        {
          type:'string',
          label:'Link,Register,Login?',
          options:['link','register','login'],
          name:'type'
        },
        {
          type: "string",
          name: "style",
          options: ["border", "button"],
        },
      ],
    },
  ],
};