import express from 'express';
import authorize from '../../../middlewares/authentication.js';
import {
  createTopic,
  deleteTopic,
  getCareerTopics,
  updateTopic,
} from '../controllers/topicController.js';
const Router = express.Router();

Router.route('/').post(authorize, createTopic);
Router.route('/:id')
  .get(getCareerTopics)
  .patch(authorize, updateTopic)
  .delete(authorize, deleteTopic);

export default Router;
