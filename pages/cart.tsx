import {
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useContext } from 'react';
import Layout from '../components/Layout';
import { StoreContext } from '../utils/Store';
import NextLink from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
const Cart = () => {
  const { state } = useContext(StoreContext);
  const cartItem = state.cart.cartItems;
  return (
    <Layout title="Shoping Cart">
      <Typography component="h1" variant="h1">
        Shopping Cart
      </Typography>
      {cartItem.length === 0 ? (
        <div>
          Cart is empty. <NextLink href="/">Go to shopping</NextLink>
        </div>
      ) : (
        <Grid container spacing={1} justifyContent="space-between">
          <Grid item xs={12} md={8}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItem.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <NextLink href={`/product/${item.slug}`} passHref>
                          <Link>
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={60}
                              height={60}
                            />
                          </Link>
                        </NextLink>
                      </TableCell>
                      <TableCell>
                        <NextLink href={`/product/${item.slug}`} passHref>
                          <Link underline="hover">
                            <Typography>{item.name}</Typography>
                          </Link>
                        </NextLink>
                      </TableCell>
                      <TableCell align="right">
                        <Select value={item.quantity} variant="standard">
                          {Array<number>(item.countInStock)
                            .fill(0)
                            .map((x, index) => (
                              <MenuItem key={index + 1} value={index + 1}>
                                {index + 1}
                              </MenuItem>
                            ))}
                        </Select>
                      </TableCell>
                      <TableCell align="right">
                        <Typography>{`$${item.price}`}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button variant="contained" color="error" size="small">
                          x
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant="h2">
                    Subtotal ({cartItem.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : $
                    {cartItem.reduce((a, c) => a + c.quantity * c.price, 0)}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button variant="contained" color="primary" fullWidth>
                    Check Out
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(Cart), { ssr: false });
