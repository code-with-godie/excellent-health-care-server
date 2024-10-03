import Users from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import NotFoundError from '../../../errors/not-found.js';
import BadRequestError from '../../../errors/bad-request.js';
import UnauthenticatedError from '../../../errors/unauthenticated.js';
import nodemailer from 'nodemailer';
export const createAccount = async (req, res, next) => {
  try {
    const {
      body: { password },
    } = req;
    const user = new Users({ ...req.body });
    if (password) {
      const hashedPassword = await user.hashPassword();
      user.password = hashedPassword;
    }
    await user.save();
    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: 'account successfully created', user });
  } catch (error) {
    next(error);
  }
};
//for admin only
export const getAllUsers = async (req, res, next) => {
  try {
    const {
      user: { userID },
    } = req;
    const users = await Users.find({ _id: { $ne: userID } }, { password: 0 });
    if (users.length === 0) {
      return res
        .status(StatusCodes.OK)
        .json({ success: true, message: 'you have no users yet!' });
    }
    return res
      .status(StatusCodes.OK)
      .json({ success: true, nbHits: users.length, users });
  } catch (error) {
    next(error);
  }
};

export const getSingleUser = async (req, res, next) => {
  try {
    const {
      params: { id: userID },
    } = req;
    const user = await Users.findOne({ _id: { $eq: userID } }, { password: 0 });
    if (!user) {
      throw new NotFoundError('no user with the provided id');
    }
    return res.status(StatusCodes.OK).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

//for Oauth
export const auth = async (req, res, next) => {
  try {
    let user = await Users.findOne({ email: req.body.email }, { password: 0 });
    if (user) {
      const token = await user.createToken();
      return res.status(StatusCodes.OK).json({ success: true, user, token });
    }
    user = new Users({ ...req.body });
    const hashedPassword = await user.hashPassword();
    user.password = hashedPassword;
    await user.save();
    const token = await user.createToken();
    const { password, ...newUser } = user._doc;
    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, user: newUser, token });
  } catch (error) {
    next(error);
  }
};

//for creditial login
export const login = async (req, res, next) => {
  try {
    const {
      body: { email, password },
    } = req;
    if (!email || !password) {
      throw new BadRequestError('please provide both email and password!');
    }
    const user = await Users.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError('INVALID EMAIL!');
    }
    const passwordMatched = await user.checkPassword(password);
    if (!passwordMatched) {
      throw new UnauthenticatedError('INVALID PASSWORD!');
    }
    const token = await user.createToken();
    const { password: removePassword, ...newUser } = user._doc;
    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, user: newUser, token });
  } catch (error) {
    next(error);
  }
};
export const updateUser = async (req, res, next) => {
  try {
    const {
      user: { userID },
    } = req;
    const user = await Users.findByIdAndUpdate(
      userID,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!user) {
      throw new NotFoundError('no use with the provided id!');
    }
    const { password, ...newUser } = user._doc;
    return res.status(StatusCodes.OK).json({ success: true, user: newUser });
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (req, res, next) => {
  try {
    const {
      params: { id: userID },
      user: { userID: loggedInUser },
    } = req;
    if (userID !== loggedInUser) {
      throw new BadRequestError('you can only delete your own account!');
    }
    const user = await Users.findByIdAndDelete(userID);
    if (!user) {
      throw new NotFoundError('no use with the provided id!');
    }
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'account successfully deleted!' });
  } catch (error) {
    next(error);
  }
};
export const enroll = async (req, res, next) => {
  try {
    const {
      user: { userID },
      params: { id: programID },
    } = req;
    let user = await Users.findById(userID);
    if (!user)
      throw new BadRequestError(
        'you need to be loggged in to perform this operation'
      );
    if (!user.enrollments?.includes(programID)) {
      user = await Users.findByIdAndUpdate(
        userID,
        { $push: { enrollments: programID } },
        { new: true, runValidators: true }
      );
      const { password, ...newUser } = user._doc;
      return res.status(StatusCodes.OK).json({
        success: true,
        user: newUser,
        message: 'successfully enrolled!',
      });
    }

    user = await Users.findByIdAndUpdate(
      userID,
      { $pull: { enrollments: programID } },
      { new: true, runValidators: true }
    );
    const { password, ...newUser } = user._doc;
    return res.status(StatusCodes.OK).json({
      success: true,
      user: newUser,
      message: 'successfull unenrolled!',
    });
  } catch (error) {
    next(error);
  }
};

export const sendEmail = async (req, res, next) => {
  try {
    const {
      body: { message, title, subject, to },
    } = req;
    const html = `
    <h2> ${title} </h2>
    <p> ${message} </p>
    `;
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.PRIMARY_EMAIL,
        pass: process.env.PRIMARY_EMAIL_PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: '1903627@students.kcau.ac.ke', // sender address
      to, // list of receivers
      subject, // Subject line
      html: html,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      info,
      message: 'email successfully sent!',
    });
  } catch (error) {
    next(error);
  }
};
