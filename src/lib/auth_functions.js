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

  export async function  handleSignup(info){
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
            organization:organization
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

export async function saveOpp(user, opp, interested) {
  try {
    // 1️⃣ Save to your DB/API
    const res = await fetch('/api/userInfo/intrested-opp', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        type: 'opp',
        filename: opp?._sys?.relativePath,
        interested: interested
      }),
    });

    if (!res.ok) {
      console.error("Failed to save opportunity to DB");
      return;
    }

    const data = await res.json();

    // 2️⃣ If user is interested, call HubSpot sync route
    if (interested) {
      await fetch('/api/hubspot/post-deal', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          opportunity: opp,
          user: user// optional: any info your API route needs
        }),
      });
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

  const res = await fetch(`/api/hubspot/get-deals?hubspotID=${encodeURIComponent(hubspotID)}`);
  if (!res.ok) throw new Error("Failed to fetch deals");
  const data = await res.json();
  return data;
}