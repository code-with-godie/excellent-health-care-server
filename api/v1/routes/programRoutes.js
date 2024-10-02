import express from 'express';
import {
  createProgram,
  getPrograms,
} from '../controllers/programsController.js';
import authorize from '../../../middlewares/authentication.js';
const Router = express.Router();

Router.route('/').get(authorize, getPrograms).post(authorize, createProgram);

export default Router;
