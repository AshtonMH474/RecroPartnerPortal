export async function handleSignout(setUser){
    try{
        const res = await fetch("/api/session/signout",{
            method:'POST',
            headers: { "Content-Type": "application/json" },
        })
       await res.json();
        await checkUser(setUser)
    }catch (err) {
      console.error(err);
    }
 }

  export async function  handleSignup(info,phone){
    const {email,firstName,lastName,password,organization} = info
    try {
      const res = await fetch("/api/session/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
             email:email, 
             password:password,
             firstName:firstName,
            lastName:lastName ,
            organization:organization,
            phone:phone
        }),
      });
      const data = await res.json();
     
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  export async function handleLogin(setUser,info)  {
    const {email,password} = info
  try {
    const res = await fetch("/api/session/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await res.json();
    
    if (res.ok) {
        await checkUser(setUser)
    } else {
      return data;
    }
  } catch (err) {
    console.error(err);
  }
};


export async function checkUser(setUser) {
    try {
        const res = await fetch("/api/session/user", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data.user || null);
      } catch (err) {
        setUser(null);
      }
}


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
  console.log("getMyDeals called with hubspotID:", hubspotID);
   if (!hubspotID) {
    throw new Error("Missing hubspotID for HubSpot request");
  }
   const res = await fetch(`/api/hubspot/get-deals?hubspotID=${encodeURIComponent(hubspotID)}`);
  if (!res.ok) throw new Error("Failed to fetch deals");
  const data = await res.json();
  console.log("Deals data:", data);
  return data;
}

// export async function getAllDeals(email) {
//   const res = await fetch(`/api/hubspot/all-deals?email=${encodeURIComponent(email)}`);
//   if (!res.ok) throw new Error("Failed to fetch deals");
//   const data = await res.json();
//   console.log("All deals data:", data);
//   return data;
// }

// lib/auth_functions.js
export async function getAllDeals(email, { limit = 20, after = null } = {}) {
  console.log(after)
  const url = `/api/hubspot/all-deals?email=${encodeURIComponent(email)}&limit=${limit}${after ? `&after=${after}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch deals");
  const data = await res.json()
  console.log(data)
  return data
}
