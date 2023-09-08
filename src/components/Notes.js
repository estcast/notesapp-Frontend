import React,{useState, useEffect} from 'react';
import {styled} from '@mui/material/styles';
import NotificationPopup from './NotificationPopup';
import Cookies from 'universal-cookie';
import axios from 'axios';
import Card from './Card';
import CircularProgress from '@mui/material/CircularProgress';

import {useNavigate} from 'react-router-dom';


const Root = styled('div')(({ theme }) => ({
  minHeight:'77vh',
  display:'flex',
  justifyContent:'center',
  alignItems:'center',
  flexFlow:'row wrap',
  width:'100%',
  '@media (max-width:700px)':{
    flexFlow:'column wrap',
    height:'auto'
  },
  '@media (max-height:700px)':{
    flexFlow:'row wrap',
    width:'auto',
    height:'auto' 
  },
}));


function Notes(){

  const [articles, setArticles] = useState([]);

  const [pop, setPop] = useState(false);                 //These 3 variables are for the Notification Pop up (on the footer)
  const [success, setSuccess] = useState('error');
  const [texts, setTexts] = useState('Error');

  const [load, setLoad] = useState(true);               //It controls the waiting circle

  const navigate = useNavigate();

  function setNotification(success, text){
    setSuccess(success);
    setTexts(text);
    setPop(true);
    setTimeout(() => {
      setPop(false);
    }, 6000); 
  };


  const url= process.env.REACT_APP_MY_NOTES;
  useEffect(()=>{
    function init(){
      const cookie = new Cookies();
      let sessionName = cookie.get('username');
      if(sessionName !== undefined){
        let jwt = cookie.get('jwt');
        axios.get(url,{headers:{Authorization:jwt}})
        .then((response)=>{
          setArticles(response.data.notes.notes);
          setLoad(false);
        })
        .catch((error)=>{
          setNotification('error', error.response?error.response.data.message:error.message);
        })
      }
      else{
        navigate('/');
      }
    }
    init();
  },[url]); 

  return(
    <Root>
      {load?<CircularProgress size='2rem' color='primary'/>:''}
      {
        articles.map(({title, text},index)=>(
          <Card 
            key={index} 
            title={title} 
            text={text} 
            setArticles={(n)=>setArticles(n)} 
            Notification={(success, message)=>setNotification(success,message)}
          />
        ))
      }
      <NotificationPopup state={pop} severity={success} text={texts} />
    </Root>
  );
}
export default Notes;