import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import Product from '../../models/Product';
import data from '../../utils/data';
import db from '../../utils/db';

interface Data {}

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await db.connectDB;
    await Product.deleteMany();
    await Product.insertMany(data.products);
    res.send({ message: 'seed successfully' });
  } catch (error) {
    res.status(500).send('error initival');
  }
});

export default handler;
