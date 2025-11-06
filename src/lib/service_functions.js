
export async function handleDownload(user,pdfUrl,type,relativePath) {
    try {
        const res = await fetch("/api/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
               email:user.email,
               pdfUrl:pdfUrl,
               type: type,
               relativePath:relativePath
          }),
        });
        const data = await res.json();
     
        return data;
      } catch (err) {
        console.error(err);
      }
  }
  
  
   export async function getCategories(setCategories) {
              try{
               const res = await fetch('/api/categories')
               if(res.ok){
                  const data = await res.json()
                  setCategories(data.categories)
                 
               }
              }catch(e){
                  console.log('Error grabbing Intrestes:', e)
              }
  }
  
  export async function postDeal(user, deal) {
    try {
      // 1️⃣ Save to your DB/API
      
      // 2️⃣ If user is interested, call HubSpot sync route
     
        let fetchI = await fetch('/api/hubspot/post-ticket', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            deal: deal,
            user: user// optional: any info your API route needs
          }),
        });
  
        if(fetchI.ok){
          const data = await fetchI.json();
          return data.message;
        }
      
  
      return data;
    } catch (err) {
      console.error(err);
    }
  }
  
  export async function deleteOpp(user,filename) {
    try{
      const res = await fetch('/api/userInfo/delete-opp',{
         method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
               email:user.email,
                filename:filename,
          }),
      })
      if(res.ok){
        const data = await res.json()
        return data
      }
      return
    }catch (err) {
        console.error(err);
    }
  }
  
  export async function fetchPartnerTickets(user) {
    const hubspotID = user?.hubspotID;
    if (!hubspotID) {
      throw new Error("Missing hubspotID for HubSpot request");
    }
  
    const res = await fetch(`/api/hubspot/get-tickets?hubspotID=${encodeURIComponent(hubspotID)}`);
    if (!res.ok) throw new Error("Failed to fetch deals");
    const data = await res.json();
    return data;
  }
  
  export async function getMyDeals(hubspotID) {
    
     if (!hubspotID) {
      throw new Error("Missing hubspotID for HubSpot request");
    }
     const res = await fetch(`/api/hubspot/get-deals?hubspotID=${encodeURIComponent(hubspotID)}`);
    if (!res.ok) throw new Error("Failed to fetch deals");
    const data = await res.json();
    return data;
  }
  
  
  // lib/auth_functions.js
  export async function getAllDeals(email, { limit = 20, after = null } = {}) {
    const url = `/api/hubspot/all-deals?email=${encodeURIComponent(email)}&limit=${limit}${after ? `&after=${after}` : ""}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch deals");
    const data = await res.json()
    return data
  }
  