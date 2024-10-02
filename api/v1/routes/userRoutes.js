import express from 'express';
import {
  auth,
  login,
  createAccount,
  getAllUsers,
  updateUser,
  getSingleUser,
  enroll,
} from '../controllers/usersController.js';
import authorize from '../../../middlewares/authentication.js';

const Router = express.Router();
Router.route('/').get(authorize, getAllUsers);
Router.route('/login').post(login);
Router.route('/enroll/:id').post(authorize, enroll);
Router.route('/register').post(createAccount);
Router.route('/auth').post(auth);
Router.route('/update-details').patch(authorize, updateUser);
Router.route('/single/:id').get(getSingleUser);
export default Router;
