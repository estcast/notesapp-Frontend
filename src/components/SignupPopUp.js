
import React,{useState} from 'react';
import {Box, Button, Typography, Modal, Fade, TextField, Checkbox,
  FormControlLabel} from '@mui/material';
  
import {styled} from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import axios from 'axios';
import NotificationPopup from './NotificationPopup';

const style = {
  position: "absolute",
  top: "40%",
  left: "50%",
  margin:"2px",
  transform: "translate(-50%, -50%)",
  width: 400,
  height:340,
  bgcolor: "beige",
  border: "3px solid black",
  boxShadow: 24,
  p: 4,
  borderRadius:"8px",
  '@media (max-width:500px)':{
    width: 280,
    height:360
  },
  '@media (max-height:500px)':{
    top: "50%",
    height:317,
    fontSize:'0.2rem'
  },
  '& h2':{
    color:"blue"
  },
  "& .inputs":{
    display:"flex",
    flexFlow:"column wrap",
    padding:"5px"
  },
  "& input":{
    fontSize:"1.2rem"
  },
  "& .recover":{
    position: "absolute",
    bottom:"5%",
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
  },
  "& .load":{
    display:"none"
  }
};

const Root = styled('div')(({ theme }) => ({
  "& .ButtonName":{
    fontWeight:"bold",
    fontSize:"1.2rem"
  }
}));


function SignupPopUp({text}) {
  const [open, setOpen] = useState(false);               //It controls the Signup pop up
  const [load, setLoad] = useState(false);               //It controls the waiting circle

  const [pop, setPop] = useState(false);                 //These 3 variables are for the Notification Pop up (on the footer)
  const [success, setSuccess] = useState('error');
  const [texts, setTexts] = useState('Error');

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [pass1,setPass1] = useState("");
  const [pass2,setPass2] = useState("");

  const handleClickOpen = () => setOpen(true);
  const handleClickClose = () => setOpen(false);

  function check_password(password1, password2){
    if(password1 !== password2){
      throw new Error('Check the password spaces, They should match');
    }
    if(password1.length < 11){
      throw new Error('Password length must be 11 digits or more');
    }
    if(!(/[0-9]/.test(password1))){
      throw new Error('Password must contain numbers, capital letters and lower case');
    }
    if(!(/[A-Z]/.test(password1))){
      throw new Error('Password must contain numbers, capital letters and lower case');
    }
    if(!(/[a-z]/.test(password1))){
      throw new Error('Password must contain numbers, capital letters and lower case');
    }
  };

  function setNotification(success, text){
    setSuccess(success);
    setTexts(text);
    setPop(true);
    setTimeout(() => {
      setPop(false);
    }, 6000);
  };

  function handleSuccess(response){
    switch(response.status){
      case 400:
        setNotification('error', response.data.message);
        break;

      case 404:
        setNotification('warning', response.data.message);
        break;

      case 200:
        setNotification('success', response.data.message);
        break;

      default:
        setNotification('error', 'Unexpected error');
        break;
    }
  };
 
  const url = process.env.REACT_APP_NOTIFY;
  function sign_up(e){
    e.preventDefault();
    try{
      check_password(pass1, pass2)
    }catch(e){
      setNotification('warning', e.message);
      return;
    }
    setLoad(true);
    axios.post(url,
      {
      name:name,
      password:pass2,
      email:email
      },
      {headers:{'Content-Type': 'application/json'}}
    ).then((response) =>{
      setLoad(false);
      handleSuccess(response);
      handleClickClose();
    }).catch((error) =>{
      setLoad(false);
      setNotification('error', error.response?error.response.data.message:error.message);
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
            <Typography  variant="h5" component="h2">
              Sign Up
            </Typography>
            <form className='inputs' onSubmit={sign_up}>
              <TextField onChange={(e)=>setName(e.target.value)} label="Name" variant="standard" required />
              <TextField onChange={(e)=>setEmail(e.target.value)}  label="E-mail" variant="standard" type="email" required />
              <TextField onChange={(e)=>setPass1(e.target.value)}  label="Enter your password" variant="standard" type="password" required />
              <TextField onChange={(e)=>setPass2(e.target.value)}  label="Re-enter your password" variant="standard" type="password" required />
              <br/>
              <FormControlLabel control={<Checkbox required/>} label="Check the box if you agree with our data treatment policies" />
              <div className='foot'>
                <Button type='submit' className='submitButton' variant="contained">
                  {load?<CircularProgress size='2rem' color='inherit'/>:'Go'}
                </Button>
              </div>
            </form>
          </Box>
        </Fade>
      </Modal>
      <NotificationPopup state={pop} severity={success} text={texts} />
    </Root>
  );
}

export default SignupPopUp;