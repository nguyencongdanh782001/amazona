import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import Product from '../../../models/Product';
import db from '../../../utils/db';

interface Data {}

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await db.connectDB;
    const products = await Product.findById(req.query.id);
    res.send(products);
  } catch (error) {
    res.status(500).send('error initival');
  }
});

export default handler;
