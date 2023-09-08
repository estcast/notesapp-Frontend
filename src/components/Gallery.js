import React from 'react';

import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import Note1 from '../images/notes1.png';

const Root = styled('div')(({ theme }) => ({
  minHeight:'77vh',
  width:'100%',
  display:'flex',
  justifyContent:'center',
  flexFlow:'row wrap', 
  alignItems:'center',
  "& .paper":{
    height:'500px',
    backgroundImage:`url(${Note1})`,
    borderRadius:'20%',
    boxShadow:'0px 0px 15px 15px #FAFFA5',
    '@media (max-height:700px)':{
      height:'300px',
    },
  },
'@media (max-height:700px)':{
  
},
'@media (max-width:700px)':{
  flexFlow:'column wrap',
  height:'auto'
},
}));

const styles = {
  width:'70%',
  height:'70%',
  borderRadius:'10px'

}

function Gallery(){
  return(
    <Root>
      <Box sx={styles}>
        <Paper className='paper' elevation={24} />
      </Box>
    </Root>
  );
}

export default Gallery;