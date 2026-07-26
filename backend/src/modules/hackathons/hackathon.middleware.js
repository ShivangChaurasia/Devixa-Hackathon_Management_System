import { hackathonRepository } from './hackathon.repository.js';
import { NotFoundError, ForbiddenError } from '../../common/errors/AppError.js';
import { asyncHandler } from '../../common/middlewares/asyncHandler.js';

export const isHackathonOrganizerOrAdmin = asyncHandler(async (req, res, next) => {
  const hackathonId = req.params.id;
  const hackathon = await hackathonRepository.findById(hackathonId);

  if (!hackathon) {
    throw new NotFoundError('Hackathon not found');
  }

  if (req.user.role !== 'ADMIN' && hackathon.organizerId.toString() !== req.user._id.toString()) {
    throw new ForbiddenError('Access denied. You are not the organizer of this hackathon.');
  }

  req.hackathon = hackathon;
  next();
});
