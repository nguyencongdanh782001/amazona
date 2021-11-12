import {
  Alert,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Slide,
  Snackbar,
  Typography,
} from '@mui/material';
import axios from 'axios';
import type { GetStaticProps, NextPage } from 'next';
import NextLink from 'next/link';
import { useContext, useState } from 'react';
import Layout from '../components/Layout';
import Product from '../models/Product';
import data from '../utils/data';
import db from '../utils/db';
import { StoreContext } from '../utils/Store';

interface ProductType {
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

interface HomePropsType {
  productList: Array<ProductType>;
}

const Home: NextPage<HomePropsType> = ({ productList }) => {
  const [open, setOpen] = useState(false);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const { state, dispatch } = useContext(StoreContext);

  const addToCartHandle = async (product: ProductType) => {
    const { data } = await axios.get(`/api/products/${product._id}`);
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (data.countInStock < quantity) {
      setOpen(true);
      return;
    }
    await dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
  };

  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {productList.map((product, index) => (
            <Grid item xs={6} md={4} key={index}>
              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia component="img" image={product.image} title={product.name} />
                    <CardContent>
                      <Typography variant="subtitle1">{product.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography variant="subtitle1">{`$${product.price}`}</Typography>
                  <Button size="small" color="primary" onClick={() => addToCartHandle(product)}>
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
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

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  await db.connectDB();
  const productList: Array<ProductType> = await Product.find({}).lean();
  return {
    props: {
      productList: productList.map(db.converDocToObj),
    },
  };
};
