import { Model } from '../models/model';

export interface FindResultDto<T extends Model> {
  data: T[];
  where: any;
  order: any;
  limit: number;
  offset: number;
  count: number;
}