import { handleDownload } from "./service_functions";

export async function downloadPdf(content){
    
    if (!content) return;

  const pdfUrl = content?.pdf;
  const type = content?.__typename
  const relativePath = content?._sys?.relativePath
  if (!pdfUrl) {
    console.error("No PDF URL found");
    return;
  }


       
    try{
        let data = await handleDownload(pdfUrl,type,relativePath)
        if(data?.error) return
    }catch(e){
        console.log(e)
        return
    }
    

  const filename = pdfUrl.split("/").pop();

  const link = document.createElement("a");
    link.href = `/api/s3/download?fileUrl=${encodeURIComponent(pdfUrl)}`;
    link.download = `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    

}