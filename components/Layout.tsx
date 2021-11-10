import { ThemeProvider } from '@emotion/react';
import {
  createTheme,
  CssBaseline,
  FormControlLabel,
  Link,
  Switch,
  Toolbar,
  Typography,
} from '@mui/material';
import Head from 'next/head';
import NextLink from 'next/link';
import React, { useContext } from 'react';
import { StoreContext } from '../utils/Store';
import { Grow, Brand, Footer, Main, NavBar, MaterialUISwitch } from '../utils/styles';

interface LaypoutProps {
  children: any;
  title?: string;
  description?: string;
}

const Layout = ({ title, description, children }: LaypoutProps) => {
  const { state, dispatch } = useContext(StoreContext);
  const darkModeHandle = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
  };
  const { darkMode } = state;
  const theme = createTheme({
    typography: {
      h1: { fontSize: '1.6rem', fontWeight: 400, margin: '1rem 0' },
      h2: { fontSize: '1.4rem', fontWeight: 400, margin: '1rem 0' },
    },
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#f0c000' },
      secondary: { main: '#208080' },
    },
  });
  return (
    <div>
      <Head>
        <title>{title ? `${title} - Next Amazona` : 'Next Amazona'}Next Amazona</title>
        {description && <meta name="description" content={description}></meta>}
        {/* <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        /> */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar position="static">
          <Toolbar>
            <NextLink href="/" passHref>
              <Link underline="hover">
                <Brand>amazona</Brand>
              </Link>
            </NextLink>
            <Grow></Grow>
            <div>
              <FormControlLabel
                control={
                  <MaterialUISwitch sx={{ m: 1 }} checked={darkMode} onChange={darkModeHandle} />
                }
                label=""
              />
              <NextLink href="/cart" passHref>
                <Link underline="hover">Cart</Link>
              </NextLink>
              <NextLink href="/Login" passHref>
                <Link underline="hover">Login</Link>
              </NextLink>
            </div>
          </Toolbar>
        </NavBar>
        <Main>{children}</Main>
        <Footer>
          <Typography>All rights reserved. Next Amazona</Typography>
        </Footer>
      </ThemeProvider>
    </div>
  );
};

export default Layout;
