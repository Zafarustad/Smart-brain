import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import brain from './brain.png';

const Logo =()=>{
    return(
        <div>
            <div className="logo center">
              <Tilt className="Tilt" options={{ max : 150 }} style={{ height: 140, width: 160}} >
                 <div className="Tilt-inner pa3"> <img style={{paddingTop:"10px"}} src={brain} alt="logo" width="90" height="90" /> </div>
              </Tilt>    
            </div>
        </div>
    )
}

export default Logo;