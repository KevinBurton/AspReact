import { ComponentDescriptor } from '../models/componentDescriptor'

export interface ReceiveComponentDataAction { type: 'RECEIVE_COMPONENT_DATA' }

export function receiveComponentData(newObject: any, componentDescriptor: ComponentDescriptor) {
  return <ReceiveComponentDataAction>{ type: 'RECEIVE_COMPONENT_DATA' };
}
