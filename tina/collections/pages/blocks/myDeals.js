import { IconPickerField } from "../../../components/IconPicker";
import * as FaIcons from "react-icons/fa";
const iconNames = Object.keys(FaIcons);

export const myDeals = {
    name:'myDeals',
    label:'My Deals',
    fields:[
        {
            name:'heading',
            label:'Heading',
            type:'rich-text'
        },
        {
            name:'background',
            label:'Do you want black or classic for background',
            type:'string',
            options:['classic','black']
        },
       
        {
            name:'options',
            label:'Options for Cards',
            list:true,
            type:'object',
            fields:[
                {
                    name:'label',
                    type:'string',
                    label:'Label for Options of Cards'
                },
                {
                    type:'string',
                    label:'Type of Cards',
                    name:'filter',
                    options:['deals','tickets']
                },
                {
                                    type:'string',
                                    name:'icon',
                                    options:iconNames,
                                    ui:{
                                        component:IconPickerField
                                    }
                                },
            ]
        },
        
        {
            name:'noDealsText',
            label:'No Deals Text',
            type:'string',
        },
        {
            label:'Label to Register a Deal',
            type:'string',
            name:'registerLabel'
        }
        
    ]
}