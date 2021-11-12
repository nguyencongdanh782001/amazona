import {
  Alert,
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  Slide,
  Snackbar,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/dist/client/router';
import Image from 'next/image';
import NextLink from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import React, { useContext } from 'react';
import Layout from '../../components/Layout';
import Product from '../../models/Product';
import db from '../../utils/db';
import { StoreContext } from '../../utils/Store';
import { Section } from '../../utils/styles';
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
  createdAt: string;
  updatedAt: string;
}

interface SlugPropsType {
  product: ProductType;
}

const Slug = ({ product }: SlugPropsType) => {
  const [open, setOpen] = React.useState(false);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const router = useRouter();
  const { state, dispatch } = useContext(StoreContext);
  const addToCartHandle = async () => {
    const { data } = await axios.get(`/api/products/${product._id}`);
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (data.countInStock <= quantity) {
      setOpen(true);
      return;
    }
    await dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };

  if (!product) {
    return <div>Product not found</div>;
  }
  return (
    <Layout title={product.name} description={product.description}>
      <Section>
        <NextLink href="/" passHref>
          <Link underline="hover">
            <Typography>back to product</Typography>
          </Link>
        </NextLink>
      </Section>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <List>
            <ListItem>
              <Typography component="h1" variant="h1">
                {product.name}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand: {product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Rating: {product.rating} starts ({product.numReviews} revirews)
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Description: {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{`$${product.price}`}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{product.countInStock > 0 ? 'In Stock' : 'Unavailable'}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button fullWidth variant="contained" color="primary" onClick={addToCartHandle}>
                  Add to cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
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

export default Slug;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  console.log(params);
  const slug = params?.slug as ParsedUrlQuery | undefined;
  await db.connectDB();
  const product: ProductType = await Product.findOne({ slug }).lean();
  return {
    props: {
      product: db.converDocToObj(product),
    },
  };
};
