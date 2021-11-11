import { useRouter } from 'next/dist/client/router';
import React from 'react';
import Layout from '../../components/Layout';
import data from '../../utils/data';
import NextLink from 'next/link';
import { Button, Card, Grid, Link, List, ListItem, Typography } from '@mui/material';
import { Section } from '../../utils/styles';
import Image from 'next/image';
import Product from '../../models/Product';
import db from '../../utils/db';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
interface ProductType {
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
}

interface SlugPropsType {
  product: ProductType;
}

const Slug = ({ product }: SlugPropsType) => {
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
                <Button fullWidth variant="contained" color="primary">
                  {' '}
                  Add to cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
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
