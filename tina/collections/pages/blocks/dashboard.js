import { IconPickerField } from "../../../components/IconPicker";
import * as FaIcons from "react-icons/fa";
const iconNames = Object.keys(FaIcons);
export const dashboardBlock = {
    name:'dashboard',
    label:'Dashboard',
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
                    options:['recent','papers','sheets','statements']
                },
                {
                    type:'string',
                    name:'icon',
                    options:iconNames,
                    ui:{
                        component:IconPickerField
                    }
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
                            label:'Label'
                        },
                        {
                            name:'link',
                            label:'Link',
                            type:'string'
                        },
                        {
                            name:'style',
                            type:'string',
                            label:'style',
                            options:['border','button']
                        }
                    ]
                }
            ]
        },
        
    ]
}