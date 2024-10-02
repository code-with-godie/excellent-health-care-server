import Posts from '../models/Post.js';
import Users from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import NotFoundError from '../../../errors/not-found.js';
import BadRequestError from '../../../errors/bad-request.js';

export const createPost = async (req, res, next) => {
  try {
    const {
      user: { userID },
      body,
    } = req;
    let post = await Posts.create({
      ...body,
      user: userID,
    });
    post = await Posts.findById(post._id).populate({
      path: 'user',
      select: 'username email avatar',
    });
    return res.status(StatusCodes.OK).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};
export const getProfilePosts = async (req, res, next) => {
  try {
    const {
      params: { id: userID },
    } = req;
    const posts = await Posts.find({ user: userID }).populate({
      path: 'user',
      select: 'username avatar email',
    });
    return res
      .status(StatusCodes.OK)
      .json({ success: true, nbHits: posts.length, posts });
  } catch (error) {
    next(error);
  }
};
export const getSavedPosts = async (req, res, next) => {
  try {
    const {
      params: { id: userID },
    } = req;
    const user = await Users.findById(userID);
    if (!user) throw new NotFoundError('no user found with the provided id');
    const posts = await Posts.find({ _id: { $in: user.bookmarked } }).populate({
      path: 'user',
      select: 'username avatar email',
    });
    return res
      .status(StatusCodes.OK)
      .json({ success: true, nbHits: posts.length, posts });
  } catch (error) {
    next(error);
  }
};

export const getSinglePost = async (req, res, next) => {
  try {
    const {
      params: { id: postID },
    } = req;
    const post = await Posts.findById(postID).populate({
      path: 'user',
      select: 'avatar username',
    });
    if (!post) {
      throw new NotFoundError('no post with the provided id');
    }
    return res.status(StatusCodes.OK).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};
export const search = async (req, res, next) => {
  try {
    let { location, type, property, minPrice, maxPrice } = req.query;
    let querryObj = {};
    if (location && location !== 'null') {
      querryObj.$or = [
        { country: { $regex: new RegExp(location, 'i') } },
        { state: { $regex: new RegExp(location, 'i') } },
        { city: { $regex: new RegExp(location, 'i') } },
      ];
    }
    if (type && type !== 'null') {
      querryObj.type = type;
    }
    if (property && property !== 'null') {
      querryObj.property = property;
    }
    // minPrice = minPrice === 'null' ? null : Number(minPrice);
    // maxPrice = maxPrice === 'null' ? null : Number(maxPrice);
    // if (minPrice && maxPrice) {
    //   querryObj = {
    //     ...querryObj,
    //     $and: [{ price: { $gte: minPrice } }, { price: { $lte: maxPrice } }],
    //   };
    // }
    const posts = await Posts.find({ ...querryObj });
    return res.status(StatusCodes.OK).json({ success: true, posts });
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
    let post = await Posts.findById(postID);
    if (!post) {
      throw new BadRequestError('no post with the provided id!');
    }
    if (post.user?.toString() !== userID) {
      throw new BadRequestError('you can only update your own posts!');
    }
    post = await Posts.findByIdAndUpdate(
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
    const post = await Posts.findById(postID);

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
export const featuredPost = async (req, res, next) => {
  try {
    const posts = await Posts.find({}).limit(15);
    return res.status(StatusCodes.OK).json({
      success: true,
      posts,
    });
  } catch (error) {
    next(error);
  }
};
