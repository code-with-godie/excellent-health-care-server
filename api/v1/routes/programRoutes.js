import express from 'express';
import {
  createProgram,
  deleteProgram,
  getPrograms,
  getSingleProgram,
  updateProgram,
} from '../controllers/programsController.js';
import authorize from '../../../middlewares/authentication.js';
const Router = express.Router();

Router.route('/').get(getPrograms).post(authorize, createProgram);
Router.route('/:id')
  .get(authorize, getSingleProgram)
  .patch(authorize, updateProgram)
  .delete(authorize, deleteProgram);

export default Router;
