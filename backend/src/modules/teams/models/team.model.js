import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
      minlength: [2, 'Team name must be at least 2 characters'],
      maxlength: [50, 'Team name cannot exceed 50 characters'],
    },
    inviteCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    hackathonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hackathon',
      required: true,
      index: true,
    },
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['FORMING', 'FINALIZED', 'DISBANDED'],
      default: 'FORMING',
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

teamSchema.index({ hackathonId: 1, name: 1 }, { unique: true });

export const Team = mongoose.model('Team', teamSchema);
