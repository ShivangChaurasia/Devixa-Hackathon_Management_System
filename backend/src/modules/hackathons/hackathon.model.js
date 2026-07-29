import mongoose from 'mongoose';

const judgingCriterionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Criterion title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    maxMarks: {
      type: Number,
      required: [true, 'Max marks is required for each criterion'],
      min: [1, 'Max marks must be at least 1'],
      max: [100, 'Max marks cannot exceed 100'],
      default: 10,
    },
  },
  { _id: true }
);

const hackathonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Hackathon title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
      index: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    theme: {
      type: String,
      required: [true, 'Theme is required (e.g. AI/ML, Web3, FinTech)'],
      trim: true,
      index: true,
    },
    mode: {
      type: String,
      enum: ['ONLINE', 'OFFLINE', 'HYBRID'],
      default: 'ONLINE',
      index: true,
    },
    venue: {
      type: String,
      default: 'Virtual / Online',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required'],
    },
    bannerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200',
    },
    prizePool: {
      type: String,
      default: 'Bragging rights & Certificates',
    },
    minTeamSize: {
      type: Number,
      default: 1,
      min: 1,
    },
    maxTeamSize: {
      type: Number,
      default: 4,
      max: 10,
    },
    rules: {
      type: [String],
      default: [],
    },
    judgingCriteria: {
      type: [judgingCriterionSchema],
      default: [
        { title: 'Innovation', maxMarks: 10, description: 'Originality and novelty of idea' },
        { title: 'Technical Complexity', maxMarks: 10, description: 'Difficulty and execution of code' },
        { title: 'UI/UX & Design', maxMarks: 10, description: 'Usability and visual appeal' },
        { title: 'Functionality', maxMarks: 10, description: 'Completeness and working state' },
      ],
    },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    judges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    pendingJudgeEmails: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: [
        'DRAFT',
        'UPCOMING',
        'REGISTRATION_OPEN',
        'REGISTRATION_CLOSED',
        'ONGOING',
        'UNDER_EVALUATION',
        'COMPLETED',
        'CANCELLED',
      ],
      default: 'DRAFT',
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Text Index for Full Text Search
hackathonSchema.index({ title: 'text', description: 'text', theme: 'text' });

export const Hackathon = mongoose.model('Hackathon', hackathonSchema);
