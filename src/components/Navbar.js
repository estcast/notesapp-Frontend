import React,{useState, useEffect} from "react";

import Styled from '@mui/material/styles/styled';
import Button from "@mui/material/Button";
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';

import LoginPopUp from "./LoginPopUp";
import SignupPopUp from "./SignupPopUp";

import Cookies from 'universal-cookie';
import {useNavigate} from 'react-router-dom';

const Root1 = Styled('header')(({ theme }) => ({
  minHeight:'17vh',
  width:'100%',
  '@media (max-width:700px)':{
    height:'17',
    "& .icon":{
      fontSize:"2.5rem",
      color:'#FAFFA5',
      display:'block'
    }
  },
  '@media (max-height:700px)':{          //Celular horizontal
    width:'auto',
    height:'auto' 
  },
  "& .main":{
    display:"flex",
    justifyContent:"space-between",
    backgroundColor:"#984C00",
  },
  "& .Options":{
    margin:"5px",
    fontSize:"1.5rem",
    cursor:"pointer",
    '@media (max-width:700px)':{
      display:'none'
    }
  },
  "& .none":{
    display:"none"
  },
  "& .title":{
    display:"flex",
    justifyContent:"center",
    backgroundColor:"#663300",
    color:"beige",
  },
  "& .ButtonName":{
    fontWeight:"bold",
    fontSize:"1.2rem",
    color:'beige',
    '@media (max-width:700px)':{
      display:'none'
    }
  },
  "& .nav":{
    display:'contents',
  },
  "& .nav2":{
    display:'inline-block',
  },
  "& .iconContainer":{
    width:'100%',
    justifyContent:"right",
    display:'none',
    '@media (max-width:700px)':{
      display:'flex'
    }
  },
  "& .icon":{
    fontSize:"2.5rem",
    color:'#FAFFA5',
    display:'none',
    cursor:'pointer',
    '@media (max-width:700px)':{
      display:'block'
    }
  },
}));

const styles={
  display:'inline',
  justifyContent:'center',

  "& .MuiDrawer-paper":{
    width:'50%'
    },
  "& .DrawerContainer":{
    height:'100%',
    backgroundColor:"#663300",
  },
  "& .OptionsDrawer":{
    margin:"5px",
    fontSize:"1.5rem",
    cursor:"pointer"
  },
  "& Button":{
    fontWeight:"bold",
    fontSize:"1.2rem",
    color:'beige',
  },
  "& .none":{
    display:"none"
  },
};

function Navbar(){

  const [isLogged, setLogged] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);        //Drawer(side menu) state

  function toMyArticles(){
    navigate('/my_notes');
    setOpen(false);
  };

  function toNew(){
    navigate('/new');
    setOpen(false);
  };

  useEffect(()=>{
    function init(){
      const cookie = new Cookies();
      let sessionName = cookie.get('username');
      if(sessionName !== undefined){
        setName(sessionName);
        setLogged(true);
      }
    }
    init();
  },[]);
                                    
  return(
    <Root1>
      <div className="title"><h1>Notes' App</h1></div>
      <div className="main">
        <nav className="nav">
          <span className="Options"> 
            <LoginPopUp 
              text={isLogged?"Log out":"Log In"} 
              login={(state)=>setLogged(state)} 
              isLogged={isLogged} 
              Name={(name)=>setName(name)}
              DrawerState={(state)=>setOpen(state)}
            /> 
          </span>
          <Button className={`ButtonName ${!isLogged?"none":""}`} onClick={toMyArticles}>My notes</Button>
          <Button className={`ButtonName ${!isLogged?"none":""}`} onClick={toNew}>Create new</Button>
          <span className={isLogged?"Options":"none"}> {name}</span>
          <span className={`Options ${isLogged?"none":""}`.trimEnd()}> <SignupPopUp text={"Sign Up"} /> </span>
          <span className="iconContainer"><MenuIcon className="icon" onClick={()=>setOpen(true)}/></span>
        </nav>
      </div>
      <Drawer 
        anchor="right" 
        open={open} 
        sx = {styles}
        onClose={() => setOpen(false)}
      >
        <div className="DrawerContainer">
          <span className="OptionsDrawer"> 
            <LoginPopUp 
              text={isLogged?"Log out":"Log In"} 
              login={(state)=>setLogged(state)} 
              isLogged={isLogged} 
              Name={(name)=>setName(name)}
              DrawerState={(state)=>setOpen(state)}
            /> 
          </span>
          <div>
            <Button className={`ButtonDrawer ${!isLogged?"none":""}`} onClick={toMyArticles}>My notes</Button>
          </div>
          <div>
           <Button className={`ButtonDrawer ${!isLogged?"none":""}`} onClick={toNew}>Create new</Button>
          </div>
          <span className={isLogged?"OptionsDrawer":"none"}> {name}</span>
          <span className={`OptionsDrawer ${isLogged?"none":""}`.trimEnd()}> <SignupPopUp text={"Sign Up"} /> </span>
        </div>
      </Drawer>
    </Root1>
  );
}

export default Navbar;