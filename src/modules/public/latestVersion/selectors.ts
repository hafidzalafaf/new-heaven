import { RootState } from '../..';
import { CommonError } from '../../types';
import { LatestVersion } from './types';

export const selectLatestVersion = (state: RootState): LatestVersion => state.public.latestVersion.data