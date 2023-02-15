import { RootState } from '../../../modules';
import { CommonError } from '../../../modules/types';
import { Feedback } from './types';

export const selectP2PCreateFeedbackSuccess = (state: RootState): boolean => state.user.p2pFeedback.create.success;
