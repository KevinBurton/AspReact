export interface GenericCollection {
    myCollection: Something[];
    itemId: number;
    componentType: string; // create enum
    baseData: BaseData;

}

export interface newClass {


}

export interface IOption {
    value: string;
    text: string;
    group?: string;
}

export interface Something {
    Id: number;
    Code: string;
    Title: string;
    Region: string;
    FormattedStartDate: string;
    IsParent: boolean;
    EventId: number;
    ItemDetailId: number;
    IsSpeakerEnabled: boolean;
    Events: Event[];

}

export interface BaseData {
    itemId: number;
    baseData1: string;
    baseData2: string;
    componentType: string;
}


export interface ComponentDescriptor {
    name: string;
    returnObjectIndexed: boolean;
    stateFunction: string;
    dataDictionary: string[];
    onComponentOperationComplete: Function;
}
