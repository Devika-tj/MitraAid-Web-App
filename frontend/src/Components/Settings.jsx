import React from 'react'
import { Button, Typography } from '@mui/material'

const Settings = () => {
  return (
    <div>
        
       <Typography variant="h6">Settings</Typography>
        <Button variant="outlined" sx={{ mt: 1, width: "100%" }}>Change Password</Button>
        <Button variant="outlined" color="error" sx={{ mt: 1, width: "100%" }}>Delete Account</Button>
    </div>
  )
}

export default Settings
