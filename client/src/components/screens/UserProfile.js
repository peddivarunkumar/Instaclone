import React, { useEffect ,useState,useContext} from "react";
import {UserContext} from "../../App";
import {useParams} from "react-router-dom"


const Profile = ()=>{
  const [userProfile,setUserProfile] = useState(null);
  const {state,dispatch} = useContext(UserContext);
  const {userid} = useParams();
  const [showfollow,setShowFollow] = useState(state?!state.following.includes(userid):true)
   
  useEffect(()=>{
    fetch(`/user/${userid}`,{
      headers:{
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
    .then(res=>res.json())
    .then(result=>{
        setUserProfile(result)
    })
  },[])


  const followUser = ()=>{
    fetch("/follow",{
      method: "put",
      headers:{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        followId: userid
      })
    })
    .then(res=>res.json())
    .then(data=>{
      
      dispatch({type: "UPDATE",payload: {following:data.following,followers: data.followers}})
      localStorage.setItem("user",JSON.stringify(data))
      setUserProfile(prevState=>{
        return {
          ...prevState,
          user:{
            ...prevState.user,
            followers:[...prevState.user.followers,data._id]
          }
        }
      })
      setShowFollow(false);
    })
  }

  const unfollowUser = ()=>{
    fetch("/unfollow",{
      method: "put",
      headers:{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        unfollowId: userid
      })
    })
    .then(res=>res.json())
    .then(data=>{
      
      dispatch({type: "UPDATE",payload: {following:data.following,followers: data.followers}})
      localStorage.setItem("user",JSON.stringify(data))
      setUserProfile(prevState=>{
        const newFollowers = prevState.user.followers.filter(item=> item!= data._id)
        return {
          ...prevState,
          user:{
            ...prevState.user,
            followers:newFollowers
          }
        }
      })
      setShowFollow(true);
    })
  }
  return (
      userProfile ?  <div style={{maxWidth: "550px",margin:"auto"}}>
      <div style={{
        display: "flex",
        justifyContent: "space-around",
        margin: "18px 0px",
        borderBottom: "1px solid grey"
        }}>
        <div>
           <img style={{height:"160px",width: "160px",borderRadius: "80px"}} alt="profile-img" src={userProfile.user.pic} />
        </div>
        <div >
          <h4>{userProfile.user.name}</h4>
          <p>{userProfile.user.email}</p>
          <div style={{display:"flex",justifyContent:"space-between",width: "108%"}}>
          <h5>{userProfile.posts.length} posts</h5>
          <h5>{userProfile.user.followers.length} followers</h5>
          <h5>{userProfile.user.following.length} following</h5>
          </div>
          {showfollow? 
            <button 
             className="btn waves-effect waves-light #64b5f6 blue darken-1" 
             onClick={()=>followUser()}
             style={{margin: "10px"}}
          >
          FOLLOW
          </button>
          : 
          <button 
              className="btn waves-effect waves-light #64b5f6 blue darken-1" 
              onClick={()=>unfollowUser()}
              style={{margin: "10px"}}
            >
           UNFOLLOW
           </button>
          }
          
           
        </div>
      </div>
       
      <div className="gallery">
       { 
         
         userProfile.posts.map(item=>{
        return <img className="item" key={item._id} alt={item.title} src={item.photo}/>
       })
       }
       
        
      </div>
    </div>
      
      
      
      
      :  <h2>Loading ...!</h2>
     

  )
}

export default Profile;