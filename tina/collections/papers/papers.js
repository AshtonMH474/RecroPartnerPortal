import { LastUpdatedField } from "../../components/LastUpdated";

export const papers = {
    name:'paper',
    label:'White Papers',
    path:'content/papers',
    format:'md',
    fields:[
        {
            name:'title',
            type:'string',
            label:'Title'
        },
        {
            name:'pdf',
            label:'Pdf',
            type:'image',
        },
        {
            name:'description',
            label:'Description',
            type:'rich-text'
        },
        {
            name: "category",
            label: "Category",
            type: "reference",
            collections: ["category"], // must match the name of your other collection
        },

        {
            name: 'lastUpdated',
            label: 'Last Updated',
            type: 'string',
            ui: {
                // Prevent editing manually
                component:LastUpdatedField
            }
        }

    ]
}