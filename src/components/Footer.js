import React from 'react';

import {styled} from '@mui/material/styles';

const Root = styled('footer')(({ theme }) => ({
 minHeight:'6vh',
 backgroundColor:'#FAFFA5',
 color:'#663300',
 display:'flex',
 justifyContent:"center",
 '@media (max-width:700px)':{
  width:'auto',
  height:'auto',
  position:'sticky', 
  bottom:'0%',
},
'@media (max-height:700px)':{
  width:'auto',

  position:'sticky',
  bottom:'0%', 
},
}));

function Footer(){
  return(
    <Root>
      © All rights reserved.
      <br/>
      Ing. est. Esteban Castro Umana
    </Root>
  );
}

export default Footer;