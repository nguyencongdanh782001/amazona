import {
  Alert,
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  MenuItem,
  Select,
  Slide,
  Snackbar,
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
import axios from 'axios';

interface CartItemType {
  _id: string;
  name: string;
  slug: string;
  category: string;
  image: string;
  price: number;
  brand: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  description: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

const Cart = () => {
  const { state, dispatch } = useContext(StoreContext);
  const [open, setOpen] = React.useState(false);
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const cartItem = state.cart.cartItems;
  const updateCartHandle = async (item: CartItemType, quantity: number) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock <= 0) {
      setOpen(true);
      return;
    } else {
      dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
    }
  };
  const removeItemHandle = (item: CartItemType) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };
  return (
    <Layout title="Shoping Cart">
      <Typography component="h1" variant="h1">
        Shopping Cart
      </Typography>
      {cartItem.length === 0 ? (
        <div>
          Cart is empty.{' '}
          <NextLink href="/" passHref>
            <Link underline="hover"> Go to shopping</Link>
          </NextLink>
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
                            <Image src={item.image} alt={item.name} width={60} height={60} />
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
                        <Select
                          value={item.quantity}
                          variant="standard"
                          onChange={(e) => updateCartHandle(item, e.target.value as number)}
                        >
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
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => removeItemHandle(item)}
                        >
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
                    Subtotal ({cartItem.reduce((a, c) => a + c.quantity, 0)} items) : $
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
      {open && (
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          TransitionComponent={Slide}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            Sorry. Product is out of stock
          </Alert>
        </Snackbar>
      )}
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(Cart), { ssr: false });
