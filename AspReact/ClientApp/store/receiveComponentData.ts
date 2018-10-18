import { ComponentDescriptor } from '../models/componentDescriptor'

interface ReceiveComponentDataAction { type: 'RECEIVE_COMPONENT_DATA' }

export default function receiveComponentData(newObject: any, componentDescriptor: ComponentDescriptor) {
  return <ReceiveComponentDataAction>{ type: 'RECEIVE_COMPONENT_DATA' };
}
