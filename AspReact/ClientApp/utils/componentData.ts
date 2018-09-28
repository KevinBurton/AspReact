import { ComponentDescriptor } from '../models/componentDescriptor';
import * as ajax from '../utils/ajax';

export const componentData = (componentDescriptor: ComponentDescriptor, operation: string) => {
  return (dispatch: Function, getState: Function) => {
      const state = getState();
      const { itemId } = state;
      if (operation === '') { operation = 'GetData' }

      var dictionary = componentDescriptor.dataDictionary;
      var s = ''; // 'ID=' + itemId + ',';

      for (var i in dictionary) {
          if (dictionary.hasOwnProperty(i)) {
              s = s + i + '=' + dictionary[i] + ',';
          }
      }

      s = s.substr(0, s.length - 1);
      console.log(componentDescriptor.name, s);
      ajax.get<any>(`/api/GenericDataHandler/ComponentData/?componentName=${componentDescriptor.name}&operation=${operation}&passedInData=${s}`)
          .then((newObject) => {
              var combinedObject: Object = newObject.ObjectToReturn;
              if (newObject.FailureList) {
                  if (!(Object.keys(newObject.FailureList).length === 0 && newObject.constructor === Object)) {
                      for (var j = 0; j < newObject.FailureList.length; j++) {
                          toastr.error(newObject.FailureList[j].Text);
                      }
                  }
              }
              if (newObject.DataList) {
                  if (!(Object.keys(newObject.DataList).length === 0 && newObject.constructor === Object)) {
                      combinedObject = objectAssign({}, newObject.ObjectToReturn[0], {
                          DataList: newObject.DataList
                      })
                  };

              }

              if (!(Object.keys(newObject).length === 0 && newObject.constructor === Object)) {
                  dispatch(receiveComponentData(combinedObject, componentDescriptor));
                  componentDescriptor.onComponentOperationComplete && componentDescriptor.onComponentOperationComplete();
              }

          })
          .fail(() => {
              console.error("could not retrieve data for item id ");
          });
  };
};
