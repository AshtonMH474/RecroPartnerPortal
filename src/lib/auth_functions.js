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


export async function handleDownload(user,pdfUrl) {
  try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
             email:user.email,
             pdfUrl:pdfUrl
        }),
      });
      const data = await res.json();
     
      return data;
    } catch (err) {
      console.error(err);
    }
}