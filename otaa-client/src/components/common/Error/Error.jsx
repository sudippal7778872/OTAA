import React from 'react'
import Button from '@mui/material/Button';
import { useHistory } from "react-router-dom";

const Error = () => {
    let history = useHistory();
    
    return (
        <div className="text-center">
        <div className="text-danger font-weight-bold"><h1>Error</h1></div>
        An error occurred.<br/>
         Click here to return to the home page.<br/>
         <Button
                         type="button"
                         // fullWidth
                         variant="contained"
                         color="primary"
                         // className={classes.submit}
                         onClick={()=>{history.push('/Home')}}
                     >
                     Home
                     </Button>
     </div>
    )
}

export default Error
