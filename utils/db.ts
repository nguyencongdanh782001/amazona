import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log('connect success');
  } catch (error) {
    console.log(error);
  }
};
const converDocToObj = (doc: any) => {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
};
const db = { connectDB, converDocToObj };
export default db;
