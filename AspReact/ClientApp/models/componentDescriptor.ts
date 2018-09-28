
export interface newClass {
}

export interface ComponentDescriptor {
    name: string;
    returnObjectType: string;
    returnObjectIndexed: boolean;
    stateFunction: string;
    dataDictionary: {};
    onComponentOperationComplete: Function;
}
