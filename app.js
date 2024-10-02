//imports
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import notFound from './middlewares/notFound.js';
import connectDB from './db/connect.js';
import errorHandlerMiddleware from './middlewares/error-handler.js';
import usersRoutes from './api/v1/routes/userRoutes.js';
import programRoutes from './api/v1/routes/programRoutes.js';
// import './socket/server.js';
//app config
const app = express();
dotenv.config();

//extra security packages
app.use(cors());
app.use(helmet());

//middlewares
app.use(express.json({ limit: 1000000000 }));

//api  routes
app.get('/', (req, res) => {
  return res
    .status(200)
    .json({ success: true, message: 'excellent health care careers app!!!' });
});
app.use('/api/v1/excellent-health/users', usersRoutes);
app.use('/api/v1/excellent-health/programs', programRoutes);

//not found route
app.use(notFound);

//error handlermindleware
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 5000;
const start = async () => {
  await connectDB(process.env.MONGO_URL);
  app.listen(port, () => console.log(`server is listening at port ${port}...`));
};

start();
