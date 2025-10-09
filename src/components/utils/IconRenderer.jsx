import * as FaIcons from "react-icons/fa";
import * as TbIcons from "react-icons/tb";

export default function IconRenderer({ iconName,size,color }) {
// grabs the right icon by name
const allIcons = {
    ...FaIcons,
    ...TbIcons,
  };
  const IconComponent = allIcons[iconName];
  if (!IconComponent) return <span>Invalid icon</span>;
//   returns the icon for display
  return <IconComponent style={{color:color,fontSize:size}}  />;
}