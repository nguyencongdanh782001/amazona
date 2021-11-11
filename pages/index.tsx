import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import type { GetStaticProps, NextPage } from 'next';
import NextLink from 'next/link';
import Layout from '../components/Layout';
import Product from '../models/Product';
import data from '../utils/data';
import db from '../utils/db';

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

interface HomePropsType {
  productList: Array<ProductType>;
}

const Home: NextPage<HomePropsType> = ({ productList }) => {
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
                  <Button size="small" color="primary">
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
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
