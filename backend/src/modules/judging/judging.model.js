import mongoose from 'mongoose';

const criterionScoreSchema = new mongoose.Schema(
  {
    criterionTitle: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    maxMarks: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: true,
      index: true,
    },
    hackathonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hackathon',
      required: true,
      index: true,
    },
    judgeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    scores: [criterionScoreSchema],
    totalScore: {
      type: Number,
      required: true,
      default: 0,
    },
    feedback: {
      type: String,
      default: '',
    },
    isFinalized: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// One review per judge per submission
reviewSchema.index({ submissionId: 1, judgeId: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);
