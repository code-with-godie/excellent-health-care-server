import express from 'express';
import authorize from '../../../middlewares/authentication.js';
import {
  createTopic,
  getCareerTopics,
} from '../controllers/topicController.js';
const Router = express.Router();

Router.route('/').post(authorize, createTopic);
Router.route('/:id').get(getCareerTopics);

export default Router;
