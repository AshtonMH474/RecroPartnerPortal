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
                            type:'string',
                            label:'Status',
                            name:'status',
                            options:['open','inReview', 'closed']
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
            ]
}