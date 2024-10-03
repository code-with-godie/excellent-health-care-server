import Program from '../models/Program.js';
import Topic from '../models/Topic.js';
import Users from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import NotFoundError from '../../../errors/not-found.js';
import BadRequestError from '../../../errors/bad-request.js';

export const createProgram = async (req, res, next) => {
  try {
    const {
      user: { userID },
      body,
    } = req;
    const user = await Users.findById(userID);
    if (!user || user.role !== 'admin')
      throw new BadRequestError('UNAUTHORIZED OPERATION');
    const post = await Program.create({
      ...body,
    });
    return res.status(StatusCodes.OK).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};
export const getSingleProgram = async (req, res, next) => {
  try {
    const {
      params: { id: postID },
    } = req;
    const career = await Program.findById(postID);
    if (!career) {
      throw new NotFoundError('no career with the provided id');
    }
    return res.status(StatusCodes.OK).json({ success: true, career });
  } catch (error) {
    next(error);
  }
};
export const getPrograms = async (req, res, next) => {
  try {
    // const user = await Users.findById(userID);
    // if (!user || user.role !== 'admin')
    //   throw new BadRequestError('UNAUTHORIZED OPERATION');
    const programs = await Program.find({}).populate();
    return res.status(StatusCodes.OK).json({ success: true, programs });
  } catch (error) {
    next(error);
  }
};
export const updateProgram = async (req, res, next) => {
  try {
    const {
      params: { id: postID },
      user: { userID },
    } = req;
    const user = await Users.findById(userID);
    if (!user || user.role !== 'admin')
      throw new BadRequestError('UNAUTHORIZED OPERATION');
    const post = await Program.findByIdAndUpdate(
      postID,
      { ...req.body },
      { new: true, runValidators: true }
    );
    return res.status(StatusCodes.OK).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};
export const deleteProgram = async (req, res, next) => {
  try {
    const {
      params: { id: postID },
      user: { userID },
    } = req;
    const user = await Users.findById(userID);
    if (!user || user.role !== 'admin')
      throw new BadRequestError('UNAUTHORIZED OPERATION');

    await Topic.deleteMany({ postID });
    await Program.findByIdAndDelete(postID);
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'post  successfully deleted!' });
  } catch (error) {
    next(error);
  }
};
