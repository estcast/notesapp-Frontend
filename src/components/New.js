import React,{useState} from 'react';

import Styled from '@mui/material/styles/styled';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import SaveIcon from '@mui/icons-material/Save';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { yellow, brown } from '@mui/material/colors';

import NotificationPopup from './NotificationPopup';
import axios from 'axios';
import Cookies from 'universal-cookie';

const Root = Styled('div')(({ theme }) => ({
  height:'77vh',
  width:'100%',
  display:'grid',
  justifyContent:'center',
  alignItems:'center',
  "& .Main":{
    width:'100%',
    display:"flex",
    alignItems:'center',
    flexFlow:"column wrap",
    "& button":{
      color:'#663300'
    },
  },
  "& .inputs":{
  padding:"5px",
  minWidth: "300px",
  margin: "0.5rem",
 }
}));

const theme = createTheme({
  palette: {
    primary:{
      main:yellow[200]
    },
    secondary:brown
  },
});


function New(){

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const [pop, setPop] = useState(false);                 //These 3 variables are for the Notification Pop up (on the footer)
  const [success, setSuccess] = useState('error');
  const [texts, setTexts] = useState('Error');

  function setNotification(success, text){
    setSuccess(success);
    setTexts(text);
    setPop(true);
    setTimeout(() => {
      setPop(false);
    }, 6000); 
  };

  function handleFailure(response){
    switch(response.status){
      case 401:
        setNotification('error', response.data.message);
        break;

      case 400:
        setNotification('info', response.data.message);
        break;

      default:
        setNotification('info', response.data.message);
        break;
    }
  };

  const url = process.env.REACT_APP_NEW;
  function save(e){
    e.preventDefault();

    if(title.length === 0){
      setNotification('warning', 'A title for the note is mandatory');
      return;
    }

    setSaving(true);

    const cookie = new Cookies();
    let sessionName = cookie.get("username");
    if (sessionName !== undefined) {
      let jwt = cookie.get("jwt");
      axios
        .post(url + title,
          {text:text},
          { headers: { Authorization: jwt, 'content-type': 'application/json' } })
        .then((response) => {
          setSaving(false);
          setNotification('success', response.data.message);
          setTitle('');
          setText('');
        })
        .catch((error) => {
          setSaving(false);
          error.response?handleFailure(error.response):setNotification('error', error.message)
        });
    }
  };

  return(
    <Root>
      <ThemeProvider theme={theme}>
        <div className='Main'>
          <div className='inputs' >
            <TextField 
              onChange={(e)=>setTitle(e.target.value)}
              label="Title" 
              variant="standard" 
              value={title}
              color="secondary"
            />
          </div>
          <div className='inputs'>
            <TextField
              onChange={(e)=>setText(e.target.value)}
              value={text}
              multiline
              rows={4}
              placeholder="Write something"
              color="secondary"
            />
          </div>
          <Button 
            variant="contained"
            onClick={save}
            disabled={saving}
            startIcon={saving?<CircularProgress size='1rem' color='secondary'/>:<SaveIcon />}
          >
            Save
          </Button>
        </div>
        <NotificationPopup state={pop} severity={success} text={texts} />
      </ThemeProvider>
    </Root>
  );
}

export default New;