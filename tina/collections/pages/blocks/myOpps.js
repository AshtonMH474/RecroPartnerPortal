import { IconPickerField } from "../../../components/IconPicker";
import * as FaIcons from "react-icons/fa";
const iconNames = Object.keys(FaIcons);

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
                    options:['saved','intrested']
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
                    options:['name','interests','date','state','agency','type']
                },
            ]
        },
        {
            name:'noOppsText',
            label:'No Opportunites Text',
            type:'string',
        },
        {
            name:'noOppsLink',
            label:'No Opportuinties Link',
            type:'string',
        }
        
    ]
}