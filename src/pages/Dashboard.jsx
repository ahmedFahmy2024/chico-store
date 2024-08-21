import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';
import Page404 from './Page404';

export default function Dashboard() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  return (
    <div>
      <Container maxWidth="xl">
        <Header onMenuIconClick={toggleDrawer} />
        <Sidebar open={isDrawerOpen} onClose={toggleDrawer} />
        
        <Outlet />
      </Container>
    </div>
  )
}
