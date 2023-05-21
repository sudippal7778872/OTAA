import React, { useState,useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';


const ForgotPasswords = () => {
  const [ShowSuccessToast, setShowSuccessToast] = useState(false)
  const handleSubmit = () => {
    setShowSuccessToast(true)
  }
  


  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Card raised sx={{ background: '#DDCEF7', height: '350px', width: '600px' }}>
        <CardHeader
          title="LOGIN CHECK"
        />
        <CardContent sx={{ textalign: "center", whiteSpace: " ", display: 'flex', justifyContent: 'center' }}>
          <Stack spacing={2}>
         
            <TextField
              required
              id="outlined"
              label="Email-ID"
              defaultValue=" "
              sx={{background:'#F5ECF9'}}
            />
            
          <br />
         <Button variant="contained" type="submit" onClick={handleSubmit} href='ForgotPassword' sx={{ padding: '10px', background: '#6E25A4'}}>SUBMIT</Button>    
         {ShowSuccessToast && <Alert severity="success">Details found</Alert>}
           
            
          </Stack>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  )


}

export default ForgotPasswords