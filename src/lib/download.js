import { handleDownload } from "./auth_functions";

export async function downloadPdf(content,user){
    
    if (!content) return;

  const pdfUrl = content?.pdf;
  const type = content?.__typename
  const relativePath = content?._sys?.relativePath
  if (!pdfUrl) {
    console.error("No PDF URL found");
    return;
  }


       
    try{
        await handleDownload(user,pdfUrl,type,relativePath)
    }catch(e){
        console.log(e)
    }
    

  const filename = pdfUrl.split("/").pop();

  const link = document.createElement("a");
    link.href = `/api/s3/download?fileUrl=${encodeURIComponent(pdfUrl)}`;
    link.download = `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    

}