import React, {useState} from 'react';
import {Box, Button, Typography, Modal, Fade, TextField} from '@mui/material';
import {styled} from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import Cookies from 'universal-cookie';
import axios from 'axios';
import NotificationPopup from './NotificationPopup';
import {useNavigate} from 'react-router-dom';
import CryptoJS from 'crypto-js';


const style = {
  position: "absolute",
  top: "40%",
  left: "50%",
  margin:"2px",
  transform: "translate(-50%, -50%)",
  width: 400,
  height:230,
  bgcolor: "beige",
  border: "3px solid black",
  boxShadow: 24,
  p: 4,
  borderRadius:"8px",
  '@media (max-width:500px)':{
    width: 280,
  },
  '& h5':{
    color:"blue"
  },
  "& .inputs":{
    display:"flex",
    flexFlow:"column wrap",
    padding:"5px"
  },
  "& input":{
    marginTop:"5px",
    fontSize:"1.5rem"
  },
  "& .recover":{
    position: "absolute",
    bottom:"1px",
    cursor:"pointer",
    fontSize:"1.2rem"
  },
  "& .recover:hover":{
    color:"blue",
    borderBottom: "2px solid blue"
  },
  "& .submitButton":{
    marginTop:"10px",
    color:"black",
    backgroundColor:"white"
  },
  "& .submitButton:hover":{
    backgroundColor:"beige"
  },
  "& .foot":{
    display:"flex",
    justifyContent:"space-between"
  }
};

const Root = styled('div')(({ theme }) => ({
  "& .ButtonName":{
    fontWeight:"bold",
    fontSize:"1.2rem"
  }
}));


function LoginPopUp({text, login, isLogged, Name, DrawerState}) {

  const [pass,setPass] = useState("");        
  const [email,setEmail] = useState("");

  const [load, setLoad] = useState(false);               //It controls the waiting circle
  const [open, setOpen] = useState(false);               //Controls the Pop up state
  const navigate = useNavigate();

  const [pop, setPop] = useState(false);                 //These 3 variables are for the Notification Pop up (on the footer)
  const [success, setSuccess] = useState('error');
  const [texts, setTexts] = useState('Error');
  

  const handleClickOpen = () => {
    if(isLogged){                                      //If user is logged, the action of handleClickOpen switches to log out
      const cookie = new Cookies();
      cookie.remove('username');
      cookie.remove('email');
      cookie.remove('jwt');
      login(false);
      Name("");
      setNotification('success', 'See you later');
      navigate('/');
    }
    else{
      setOpen(true)
    }
      
  };

  const handleClickClose = () => setOpen(false);

  function setNotification(success, text){
    setSuccess(success);
    setTexts(text);
    setPop(true);
    setTimeout(() => {
      setPop(false);
    }, 6000); 
  };

  function handleSuccess(response){
    let data = response.data;
    setNotification('success', data.message);
    setOpen(false);
    const cookie = new Cookies();
    cookie.set('username',data.user);
    cookie.set('email',data.email);
    cookie.set('jwt',data.jwt);
    login(true);
    Name("Hello " + data.user);
    navigate('/my_notes');
  };

  const url = process.env.REACT_APP_LOGIN;
  function log_in(e){
    e.preventDefault();

    if(email.length === 0 || pass.length === 0){
      setNotification('error', 'Please write your e-mail and password');
      return;
    }

    setLoad(true);
    axios.post(url,
      {
      email:email,
      password:CryptoJS.SHA256(pass).toString()
      },
      {headers:{'Content-Type': 'application/json'}}
    ).then((response) =>{
      setLoad(false);
      handleSuccess(response); 
      setTimeout(() => {
        DrawerState(false);
      }, 1500); 
      
    }).catch((error) =>{
      setLoad(false);
      setNotification('error', error.response?error.response.data.message:error.message);
      handleClickClose();
    });
  };

  return (
    <Root>
      <Button className='ButtonName' onClick={handleClickOpen}>{text}</Button>
      <Modal className='login'
        open={open}
        onClose={handleClickClose} 
        closeAfterTransition
        slotProps={{
          backdrop:{
            timeout:900                   // Time for PopUp to appear, measured in milliseconds
          }
        }}
      >
        <Fade in={open}>
          <Box sx={style} >
            <Typography variant="h5">
              Log In
            </Typography>
            <form className='inputs' onSubmit={log_in}>
              <TextField onChange={(e)=>setEmail(e.target.value)} label="E-mail" variant="standard" type='email'/>
              <TextField onChange={(e)=>setPass(e.target.value)} label="Password" variant="standard" type="password"/>
              <div className='foot'>
                <Button 
                  type='submit' 
                  className='submitButton' 
                  variant="contained"
                  disabled={load}
                >
                  {load?<CircularProgress size='2rem' color='inherit'/>:'Go'}
                </Button>
              </div>
            </form>
            <span className='recover'>Recover Password</span>
          </Box>
        </Fade>
      </Modal>
      <NotificationPopup state={pop} severity={success} text={texts} />
    </Root>
  );
}

export default LoginPopUp;
