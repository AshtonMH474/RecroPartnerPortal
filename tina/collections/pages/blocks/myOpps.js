export const myOpps = {
    name:'myOpps',
    label:'My Opportunites',
    fields:[
        {
            name:'heading',
            label:'Heading',
            type:'rich-text'
        },
        {
            name:'labelView',
            type:'string',
            label:'Label for Viewing Opportunites'
        },
        {
            name:'labelSaved',
            type:'string',
            label:'Label for Saved Opportunites'
        },
        {
            name:'filters',
            label:'Filters',
            list:true,
            type:'object',
            fields:[
                {
                    name:'label',
                    type:'string',
                    label:'Label'
                },
                {
                    type:'string',
                    label:'Type of Filter',
                    name:'filter',
                    options:['name','interests','date','state','agency','type']
                },
            ]
        },
        
    ]
}