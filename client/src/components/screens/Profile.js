import React, { useEffect ,useState,useContext} from "react";
import {UserContext} from "../../App";

const Profile = ()=>{
  const [pics,setPics] = useState([])
  const {state,dispatch} = useContext(UserContext);
  const [image,setImage] = useState("");
  const [url,setUrl] = useState("");
  useEffect(()=>{
    fetch("/myposts",{
      headers:{
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
    .then(res=>res.json())
    .then(result=>{
       setPics(result.myposts);
    })
  },[])
 
  useEffect(()=>{
      if(image){
        const data = new FormData();
        data.append("file",image);
        data.append("upload_preset","insta-clone");
        data.append("clound_name","instagramclonevarun")
        fetch("https://api.cloudinary.com/v1_1/instagramclonevarun/image/upload",{
            method: "post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
      
            setUrl(data.url);
          

            fetch(
              "/updatepic",
              {
               method: "put",
               headers:{
                 "Authorization": "Bearer " + localStorage.getItem("jwt"),
                 "Content-Type": "application/json"
               }
              ,
              body:JSON.stringify({pic: data.url})

              
          })
          .then(res=>res.json())
          .then(result=>{
            localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}));
            dispatch({type:"UPDATEPIC",payload:result.pic})
          })
        })
        .catch(err=>{
            console.log(err);
        })
      }
  },[image])
  const updatePhoto = (file)=>{
    setImage(file);
  }
  return (
      <div style={{maxWidth: "550px",margin:"auto"}}>
         <div style={{margin: "18px 0px",borderBottom: "1px solid grey"}}>
        <div style={{
          display: "flex",
          justifyContent: "space-around",
          
          }}>
          <div>
             <img style={{height:"160px",width: "160px",borderRadius: "80px"}} alt="profile-img" src={state?state.pic:"Loading"} />
             
          </div>
          <div >
            <h4>{state?state.name:"Loading"}</h4>
            <p>{state?state.email:"Loading"}</p>
           
            <div style={{display:"flex",justifyContent:"space-between",width: "108%"}}>
            <h5>{pics.length} posts</h5>
            <h5>{state?state.followers.length:"0"} followers</h5>
            <h5>{state?state.following.length:"0"} following</h5>
            </div>
           
          </div>
        </div>

        <div className="file-field input-field" style={{margin: "10px"}}>
            <div className="btn #64b5f6 blue darken-1">
                <span>UPDATE PIC</span>
                <input type="file" onChange={(e)=>{updatePhoto(e.target.files[0])}}/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
          </div>
           </div>
        <div className="gallery">
         { 
           
           pics.map(item=>{
          return <img className="item" key={item._id} alt={item.title} src={item.photo}/>
         })
         }
         
          
        </div>
      </div>

  )
}

export default Profile;