import { Something } from './something'
import { BaseData } from './baseData'

export interface GenericCollection {
  myCollection: Something[];
  itemId: number;
  componentType: string; // create enum
  baseData: BaseData;

}
