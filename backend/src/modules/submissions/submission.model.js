import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [2, 'Project name must be at least 2 characters'],
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    problemStatement: {
      type: String,
      required: [true, 'Problem statement is required'],
    },
    solution: {
      type: String,
      required: [true, 'Solution description is required'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    githubUrl: {
      type: String,
      required: [true, 'GitHub Repository URL is required'],
    },
    liveDemoUrl: {
      type: String,
      default: '',
    },
    techStack: {
      type: [String],
      required: [true, 'Tech stack is required'],
    },
    screenshots: {
      type: [String],
      default: [],
    },
    presentationPdf: {
      type: String,
      default: '',
    },
    demoVideoLink: {
      type: String,
      default: '',
    },
    hackathonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hackathon',
      required: true,
      index: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
      index: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    aiReviewScore: {
      type: Number,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Compound Index: One submission per team per hackathon
submissionSchema.index({ hackathonId: 1, teamId: 1 }, { unique: true });

export const Submission = mongoose.model('Submission', submissionSchema);
