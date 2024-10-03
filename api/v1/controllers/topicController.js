import Topic from '../models/Topic.js';
import Users from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import NotFoundError from '../../../errors/not-found.js';
import BadRequestError from '../../../errors/bad-request.js';

export const createTopic = async (req, res, next) => {
  try {
    const {
      user: { userID },
      body,
    } = req;
    const user = await Users.findById(userID);
    if (!user || user.role !== 'admin')
      throw new BadRequestError('UNAUTHORIZED OPERATION');
    const post = await Topic.create({
      ...body,
    });
    return res.status(StatusCodes.OK).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};
export const getCareerTopics = async (req, res, next) => {
  try {
    const {
      params: { id: careerID },
    } = req;
    const topics = await Topic.find({ careerID });
    if (!topics) {
      throw new NotFoundError('no career with the provided id');
    }
    return res.status(StatusCodes.OK).json({ success: true, topics });
  } catch (error) {
    next(error);
  }
};
export const getPrograms = async (req, res, next) => {
  try {
    // const user = await Users.findById(userID);
    // if (!user || user.role !== 'admin')
    //   throw new BadRequestError('UNAUTHORIZED OPERATION');
    const programs = await Topic.find({}).populate();
    return res.status(StatusCodes.OK).json({ success: true, programs });
  } catch (error) {
    next(error);
  }
};
export const updatePost = async (req, res, next) => {
  try {
    const {
      params: { id: postID },
      user: { userID },
    } = req;
    let post = await Topic.findById(postID);
    if (!post) {
      throw new BadRequestError('no post with the provided id!');
    }
    if (post.user?.toString() !== userID) {
      throw new BadRequestError('you can only update your own posts!');
    }
    post = await Topic.findByIdAndUpdate(
      postID,
      { ...req.body },
      { new: true, runValidators: true }
    );
    return res.status(StatusCodes.OK).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};
export const deletePost = async (req, res, next) => {
  try {
    const {
      params: { id: postID },
      user: { userID },
    } = req;
    const post = await Topic.findById(postID);

    if (!post) {
      throw new BadRequestError('no post with the provided id!');
    }
    if (post.userID !== userID) {
      throw new NotFoundError('you can only delete your own posts!');
    }
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'post  successfully deleted!' });
  } catch (error) {
    next(error);
  }
};
