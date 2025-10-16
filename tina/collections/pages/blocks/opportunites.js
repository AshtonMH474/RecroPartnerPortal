import { IconPickerField } from "../../../components/IconPicker";
import * as FaIcons from "react-icons/fa";
const iconNames = Object.keys(FaIcons);

export const opportunitesBlock = {
    name:'opportunites',
    label:'Opportunites',
    fields: [
         {
            name:'heading',
            label:'Heading',
            type:'rich-text'
        },
        {
                    name:'filters',
                    label:'Filter Names',
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
                            options:['intrests','new']
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
            name:'labelView',
            type:'string',
            label:'Label for Viewing Opportunites'
        },
        {
            name:'labelIntrested',
            type:'string',
            label:'Label for Intrested Opportunites'
        },
        {
            name:'buttons',
            label:'Buttons',
            type:'object',
            list:true,
            fields:[
                {
                    name:'label',
                    type:'string',
                    label:'Label for Button'
                },
                {
                    name:'style',
                    type:'string',
                    label:'Button Style',
                    options:['border','button']
                },
                {
                    name:'link',
                    label:'Link',
                    type:'string'
                }
            ]
        }
        

        
    ]
}