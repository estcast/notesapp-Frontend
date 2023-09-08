import React,{useState, useEffect} from "react";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { yellow } from '@mui/material/colors';

import axios from 'axios';
import Cookies from 'universal-cookie';


const circularStyles = {
  color:'white'
}

const style = {
  textAlign: "center",

  backgroundColor: "#984C00",
  color: "white",
  border: "solid black 2px",
  borderRadius: "8px",
  margin: "0.5rem",
  width: "300px",
  height:'210px',
  position:'relative',
  "& .content":{
    display:'block',
    width:'100%',
    justifyContent:'center',
    position:'absolute',
    top:'1px',
    padding:'0px',
    "& .textField":{
      border:'2px solid beige',
      width:'95%',
      height:'85%',
      "& textArea":{
        color:'beige'
      }
    }
  },
  "& .Buttons": {
    position:'absolute',
    bottom:'1px',
    width:'100%',
    justifyContent:'center',
    height:'45px',
    padding:'0px',
    "& button":{
      color:'#663300'
    }
  },
  '@media (max-width:600px)':{
    width:'300px',
    margin:'4px auto '
  }
};

const theme = createTheme({
  palette: {
    primary:{
      main:yellow[200]
    }
  },
});


function Card1({ title, text, setArticles, Notification}) {

  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changed, setChange] = useState(true);
  const [text_note, setTextNote] = useState(text);
  const [current_note] = useState(text);

  useEffect(()=>{
    function init(){
      current_note === text_note?setChange(true):setChange(false);
    }
    init();
  },[text_note, current_note]); 

  const url = process.env.REACT_APP_DELETE;
  function remove() {
    setDeleting(true);

    const cookie = new Cookies();
    let sessionName = cookie.get("username");
    if (sessionName !== undefined) {
      let jwt = cookie.get("jwt");
      axios
        .delete(url + title, { headers: { Authorization: jwt } })
        .then((response) => {
          Notification('success', response.data.message);
          setArticles(response.data.notes.notes);
          setDeleting(false);
        })
        .catch((error) => {
          console.log(error);
          Notification('error', error.response?error.response.data.message:error.message);
        });
    }
  };

  const url2 = process.env.REACT_APP_EDIT;
  function edit() {
    setSaving(true);

    const cookie = new Cookies();
    let sessionName = cookie.get("username");
    if (sessionName !== undefined) {
      let jwt = cookie.get("jwt");
      axios
        .put(url2 + title, 
          { text:text_note },
          { headers: { Authorization: jwt, 'content-type': 'application/json' } })
        .then((response) => {
          Notification('success', response.data.message);
          setSaving(false);
          setChange(true);
        })
        .catch((error) => {
          Notification('error', error.response?error.response.data.message:error.message);
          setSaving(false);
        });
    }
  };

  return (
    <Card sx={style}>
      <ThemeProvider theme={theme}>
        <CardContent className="content">
          <Typography variant="h5">{title}</Typography>
          <TextField 
            className="textField"
            onChange={
              (e)=>{
                setTextNote(e.target.value);
              }
            }
            value={text_note}
            multiline
            rows={4}
            fullWidth={true}
          />
        </CardContent>
        <CardActions className="Buttons">
          <Button
            color="primary"
            variant="contained"
            onClick={remove}
            disabled={deleting || saving}
            startIcon={deleting?<CircularProgress size={'1rem'} sx={circularStyles}/>:<DeleteIcon />}
          >
            Delete
          </Button>
          <Button 
            variant="contained" 
            onClick={edit}
            startIcon={saving?<CircularProgress size={'1rem'} sx={circularStyles}/>:<EditIcon />}
            disabled={(deleting || saving) || changed }
          >
            Save
          </Button>
        </CardActions>
      </ThemeProvider>
    </Card>
  );
}

export default Card1;
