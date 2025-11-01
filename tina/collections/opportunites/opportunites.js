import { LastUpdatedField } from "../../components/LastUpdated";

export const opportunites = {
            name:'opportunites',
            label:'Opportunites',
            path:'content/opportunites',
            format:'md',
            fields:[
                {
                    name:'title',
                    label:'Title',
                    type:'string'
                },
                {
                    name:'agency',
                    label:'Agency',
                    type:'string'
                },
                {
                    name:'type',
                    type:'string',
                    label:'Type'
                },
                {
                    name:'location',
                    type:'string',
                    label:'Location'
                },
                 {
                    name:'vehicle',
                    type:'string',
                    label:'Contract Vehicle'
                },
                {
                    name:'program',
                    type:'string',
                    label:'Program'
                },
                {
                    name:'samLink',
                    type:'string',
                    label:'SAM.gov Link'
                },
                {
                    name:'value',
                    type:'number',
                    label:'Estimated Value ($)'
                },
                {
                            type:'string',
                            label:'Status',
                            name:'status',
                            options:['open','In Review', 'closed']
                },
                {
                    name:'date',
                    type:'datetime',
                    label:'Deadline'
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