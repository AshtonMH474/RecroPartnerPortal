export const sheetsBlock = {
    name:'sheets',
    label:'My Sheets',
    fields:[
        {
            name:'heading',
            label:'Heading',
            type:'rich-text'
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
                    options:['name','interests','date']
                },
            ]
        },
        
    ]
}