import { IconPickerField } from "../../components/IconPicker"
import * as FaIcons from "react-icons/fa";
const iconNames = Object.keys(FaIcons);
const nav = {
    name:'nav',
    label:'Navigation',
    path:'content/nav',
    format:'md',
    fields:[
        {
            name:'logo',
            label:"Logo",
            type:'image'
        },
        {
            name:'height',
            label:'Logo Height(px)',
            type:'number',
        },
        {
            name:'links',
            label:'Profile Links',
            type:'object',
            list:true,
            fields:[
                {
                    type:'string',
                    name:'link',
                    label:'Link'
                },
                {
                    type: "string",
                    name: "label",
                    label:'Label'
                },
                {
                    type:'string',
                    label:'Link,Register,Login?',
                    options:['link','register','login', 'logout','edit profile'],
                    name:'type'
                },
            ]
        },
        {
            name:'sidebar_top_links',
            type:'object',
            label:'Links for Side Bar Top',
            list:true,
            fields:[
                {
                    type:'string',
                    name:'link',
                    label:'Link'
                },
                {
                    type: "string",
                    name: "label",
                    label:'Label'
                },
                {
                    type:'string',
                    label:'Link,Register,Login?',
                    options:['link','register','login', 'logout','edit profile'],
                    name:'type'
                },
                {
                    name:'icon',
                    type:'string',
                    options:iconNames,
                    ui:{
                        component:IconPickerField
                    }
                },
            ]
        },
        {
            name:'sidebar_bottom_links',
            type:'object',
            label:'Links for Side Bar Bottom',
            list:true,
            fields:[
                {
                    type:'string',
                    name:'link',
                    label:'Link'
                },
                {
                    type: "string",
                    name: "label",
                    label:'Label'
                },
                {
                    type:'string',
                    label:'Link,Register,Login?',
                    options:['link','register','login', 'logout','edit profile'],
                    name:'type'
                },
                {
                    name:'icon',
                    type:'string',
                    options:iconNames,
                    ui:{
                        component:IconPickerField
                    }
                },
            ]
        }

    ]
}

export default nav