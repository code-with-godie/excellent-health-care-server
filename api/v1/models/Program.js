import mongoose from 'mongoose';

const ProgramSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: [2, 'username cannot be less than 2 charactors'],
      required: [true, 'please provide program title!'],
    },
    description: {
      type: [],
    },
    image: {
      type: String,
    },
    normal: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model?.users ||
  mongoose.model('programs', ProgramSchema);
