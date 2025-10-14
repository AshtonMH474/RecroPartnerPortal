import { IconPickerField } from "../../components/IconPicker"
import * as FaIcons from "react-icons/fa";
const iconNames = Object.keys(FaIcons);

export const categories = {
    name:'category',
    label:'Category',
    path:'content/categories',
    format:'md',
    fields:[
        {
            name:'category',
            label:'Category Name',
            type:'string'
        },
        {
            name:'icon',
            type:'string',
            options:iconNames,
            ui:{
                component:IconPickerField
            }
        }
    ]
}