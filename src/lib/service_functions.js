import { fetchWithCsrf } from "./csrf";

export async function handleDownload(pdfUrl, type, relativePath) {
    try {
        const res = await fetchWithCsrf("/api/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: 'include', // Send cookies for authentication
          body: JSON.stringify({
               pdfUrl: pdfUrl,
               type: type,
               relativePath: relativePath
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
  
  export async function postDeal(deal) {
    try {
      // 1️⃣ Save to your DB/API
      
      // 2️⃣ If user is interested, call HubSpot sync route
      
        let fetchI = await fetchWithCsrf('/api/hubspot/post-ticket', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            deal: deal,
            
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
  

  
  export async function fetchPartnerTickets() {
    // Authentication is handled by middleware, cookies are sent automatically
    const res = await fetch(`/api/hubspot/get-tickets`, {
      credentials: 'include' // Ensure cookies are sent
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch tickets");
    }
    const data = await res.json();
    return data;
  }
  
  export async function getMyDeals() {
    const res = await fetch(`/api/hubspot/get-deals`, {
      credentials: 'include' // Send cookies for authentication
    });
    if (!res.ok) throw new Error("Failed to fetch deals");
    const data = await res.json();
    return data;
  }
  
  
  // lib/auth_functions.js
  export async function getAllDeals({ limit = 20, after = null } = {}) {
    const url = `/api/hubspot/all-deals?limit=${limit}${after ? `&after=${after}` : ""}`;
    const res = await fetch(url, {
      credentials: 'include' // Send cookies for authentication
    });
    if (!res.ok) throw new Error("Failed to fetch deals");
    const data = await res.json()
    return data
  }
  
 export const sortByDateDesc = (arr) =>
    [...arr].sort(
      (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
    );

  export const filterByInterests = (arr, interests) => {
    if (!interests.size || !arr) return [];
    return arr.filter((item) => interests.has(item.category?._sys?.filename))
    .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
    .slice(0, 8);
  }