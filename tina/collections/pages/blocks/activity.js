import { IconPickerField } from "../../../components/IconPicker";
import * as FaIcons from "react-icons/fa";
const iconNames = Object.keys(FaIcons);

export const activityBlock = {
    name:'activity',
    label:'My Activity',
    fields:[
        {
            name:'heading',
            label:'Heading',
            type:'rich-text'
        },
        {
            
                        name:'type',
                        label:'Type',
                        type:'object',
                        list:true,
                        fields:[
                            {
                                type:'string',
                                label:'Label for Filter',
                                name:'label'
                            },
                            {
                                type:'string',
                                label:'Type of Filter',
                                name:'filter',
                                options:['papers','sheets']
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
        {
            name:'noActivityText',
            label:'No Activity Text',
            type:'string',
        },
       
        
        
    ]
}