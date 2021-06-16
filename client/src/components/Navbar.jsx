/*jshint esversion: 6 */
import React,{useContext} from 'react';
import {Link,useHistory} from "react-router-dom";
import {UserContext} from "../App"

function Navbar(){
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory();
  const renderList = ()=>{
    if(state){
      return (<React.Fragment> 
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/create">Create Post</Link></li>
        <li><Link to="/postfollowing">My following posts</Link></li>
        <li> <button className="btn #c62828 red darken-3" onClick={()=>{localStorage.clear();dispatch({type:"CLEAR"});history.push("/signin")}}>
        LOGOUT
        </button></li>
        </React.Fragment>)
    }else{
      return(
        <React.Fragment>
          <li><Link to="/signin">Login</Link></li>
          <li><Link to="/signup">Signup</Link></li>
        </React.Fragment>)
      
    }
  }
  return   <nav>
    <div className="nav-wrapper white">
      <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
      <ul id="nav-mobile" className="right">
           {renderList()}
      </ul>
    </div>
  </nav>

}

export default Navbar;
