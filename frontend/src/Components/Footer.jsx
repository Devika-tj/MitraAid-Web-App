import React from 'react'
import { Box, Typography, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';


const Footer = () => {
    return (
        <div>
            <Box sx={{ backgroundColor: '#f5f5f5', p: 4, mt: 4 }}>
                <Typography variant="body1" gutterBottom>
                 Our mission at MitraAid is to build a community-driven first response platform where people come together to save lives during emergencies. By connecting donors, volunteers, and those in urgent need, we aim to provide timely assistance, promote the spirit of compassion, and ensure that no one faces a crisis alone. We believe that when a community stands united, every response becomes stronger, faster, and life-saving
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <IconButton><FacebookIcon /></IconButton>
                    <IconButton><InstagramIcon /></IconButton>
                    <IconButton><LinkedInIcon /></IconButton>
                    <IconButton><YouTubeIcon /></IconButton>
                </Box>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography variant="body2">© 2025 - MitraAid</Typography>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Typography variant="body2" component="a" href="/accessibility" sx={{ textDecoration: 'none', color: 'inherit',textAlign:'center' }}>
                            Accessibility
                        </Typography>
                        <Typography variant="body2" component="a" href="/sitemap" sx={{ textDecoration: 'none', color: 'inherit' }}>
                            Sitemap
                        </Typography>
                        <Typography variant="body2" component="a" href="/disclaimer" sx={{ textDecoration: 'none', color: 'inherit' }}>
                            Disclaimer
                        </Typography>
                        <Typography variant="body2" component="a" href="/legal" sx={{ textDecoration: 'none', color: 'inherit' }}>
                            Legal Notice
                        </Typography>
                        <Typography variant="body2" component="a" href="/report" sx={{ textDecoration: 'none', color: 'inherit' }}>
                            Report a Concern
                        </Typography>
                    </Box>
                </Box>
            </Box>

        </div>
    )
}

export default Footer