import React, { useEffect, useState,useContext } from "react";
import {UserContext} from "../../App";
import {Link} from "react-router-dom";


const Home = ()=>{
  const [data,setData] = useState([]);
  const {state,dispatch} = useContext(UserContext);
  useEffect(()=>{
      fetch('/postfollowing',{
        headers:{
          "Authorization": "Bearer "+localStorage.getItem("jwt")
        }
      })
      .then(res=>res.json())
      .then(result=>{
        
        setData(result.posts);
      })
  },[])

  const likePost = (id)=>{
     fetch("/like",{
       method: "put",
       headers:{
         "Content-Type":"application/json",
         "Authorization": "Bearer " + localStorage.getItem("jwt")
       },
       body:JSON.stringify({
         postId:id
       })
     }).then(res=>res.json())
     .then(result=>{
      const newData = data.map(item=>{
        if(item._id === result._id){
          return result;
        }else{
          return item;
        }
      })
      setData(newData);
     }).catch(err=>{
       console.log(err);
     })
  }

  const unLikePost = (id)=>{
    fetch("/unlike",{
      method: "put",
      headers:{
        "Content-Type":"application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postId:id
      })
    }).then(res=>res.json())
    .then(result=>{
      const newData = data.map(item=>{
        if(item._id === result._id){
          return result;
        }else{
          return item;
        }
      })
      setData(newData);
    })
    .catch(err=>{
      console.log(err);
    })
 }

 const makeComment = (text,postId)=>{
     fetch("/comment",{
       method: "put",
       headers:{
         "Content-Type":"Application/json",
         "Authorization": "Bearer " + localStorage.getItem("jwt")
       },
       body:JSON.stringify({
         postId,
         text
       })
     })
     .then(res=>res.json())
     .then(result=>{
         const newData = data.map(item=>{
           if(item._id === result._id){
             return result;
           }else{
           return item;
           }
         })
         setData(newData);
     })
     .catch(err=>{
       console.log(err)
     })
 }

 const deleteComment = (postId)=>{
   fetch(`deletecomment/${postId}`,
     {
      method: "delete",
      headers: {
        "Content-Type": "Application/json",
        "Authorization":"Bearer " + localStorage.getItem("jwt")
      }
     })
     .then(res=>res.json())
     .then(result=>{
       const newData = data.map(item=>{
         return item._id===result._id ? result : item
       })
       setData(newData);
     })
     .catch(err=>{
       console.log(err)
     })
}

 const deletePost = (postId)=>{
   fetch(`/deletepost/${postId}`,{
     method: "delete",
     headers: {
       Authorization: "Bearer " + localStorage.getItem("jwt")
     }
   })
   .then(res=>res.json())
   .then(result=>{
     console.log(result)
     const newData = data.filter(item=>{
       return item._id !== result._id
     })
     setData(newData);
   })
   .catch(err=>{
     console.log(err);
   })
 }
 

  return (
     <div className = "home">
     {
       data.map((item)=>{
         return (
          <div key={item._id} className = "card home-card">
            <h5 style={{padding: "5px"}}><Link to={item.postedBy._id == state._id ?"/profile":`/profile/${item.postedBy._id}`}>{item.postedBy.name}</Link>{item.postedBy._id == state._id && <i onClick={()=>{deletePost(item._id)}} style={{float: "right"}} className="material-icons">delete</i>}</h5>
            <div className="card-image">
              <img src={item.photo} alt="post-img"/>
            </div>
            <div className="card-content">
            <i className="material-icons" style={{color: "red"}}>favorite</i>
            { !item.likes.includes(state._id) && <i className="material-icons" onClick={()=>likePost(item._id)}>thumb_up</i>}
             {item.likes.includes(state._id) &&  <i className="material-icons" onClick={()=>unLikePost(item._id)}>thumb_down</i> }
           
              <h6>{item.likes.length} likes</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              {item.comments.map(record=>{
                return  <h6 key={record._id}>{state._id == record.postedBy._id && <span style={{marginRight: "10px"}}><i onClick={()=> deleteComment(item._id)}className="material-icons">delete</i></span>}<span style={{fontWeight: 500}}>{record.postedBy.name}</span> {record.text}</h6>
              })}
              <form onSubmit={(e)=>{
                e.preventDefault();
                makeComment(e.target[0].value,item._id)
              }}>
                <input type="text" placeholder="add a comment"/>
              </form>
            </div>
       </div>
         )
       })
     }
       

  

      
     </div>
  )
}

export default Home;