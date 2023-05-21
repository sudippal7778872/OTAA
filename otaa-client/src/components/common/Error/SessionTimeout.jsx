import React from 'react'
import Button from '@mui/material/Button';
import { useHistory } from "react-router-dom";

const SessionTimeOut = () => {
    let history = useHistory();

    return (
        <div className="text-center">
        <div className="text-danger font-weight-bold"><h1>Session Expired</h1></div>
        Sorry, your session is expired. Please re-login to continue.<br/>
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

export default SessionTimeOut