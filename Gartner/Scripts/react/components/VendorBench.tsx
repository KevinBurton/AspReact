import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/genericActions';
import { ComponentDescriptor } from '../models/generic';
import { Label } from './Form';
import ComboBox from './kendo/ComboBox';


export interface Vendor {
    Id: number;
    VendorNmTxt: string;
    VendorId: string;
}

export interface VendorBenchProps {
    getComponentData: (component: Object) => void;
    componentDescriptor: ComponentDescriptor;
    VendorBench: Object;
}

const VendorBenchComponent = React.createClass<VendorBenchProps, any>({

    componentWillMount() {
        this.componentDescriptor = {
            name: 'VendorBench',
            returnObjectIndexed: false,
            stateFunction:
            '(objectAssign.default({}, state, { VendorBench: action.newObject});)',
            dataDictionary: {
                ID: 0,
                ItemId: 0,
                VendorId: 0
            }
        }
        this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
        this.props.componentData(this.componentDescriptor, 'GetData');
    },


    componentDidMount() {

    },

    upsertChange: function (vendor: any) {
        if (vendor != "") {
         
            this.componentDescriptor.dataDictionary['VendorId'] = vendor;
            this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
            this.props.componentData(this.componentDescriptor, 'Upsert');
            this.props.eventEmitter.emitEvent('ReviewerRefresh', [this.props.itemId]);
            this.props.eventEmitter.emitEvent('QVRRefresh', [this.props.itemId]);
        }
    },

    removeSelectedVendor(vendor: any) {
     
        this.componentDescriptor.dataDictionary['ID'] = vendor.ID.Value;
        this.componentDescriptor.dataDictionary['ItemId'] = this.props.itemId;
        this.componentDescriptor.dataDictionary['VendorId'] = vendor.VendorId.Value;
        this.props.componentData(this.componentDescriptor, 'Delete');

        this.props.eventEmitter.emitEvent('ReviewerRefresh', [this.props.itemId]);
        this.props.eventEmitter.emitEvent('QVRRefresh', [this.props.itemId]);

    },


    render() {
        
        return (
            <div id="VendorBench">
                <div className="form-group">
                    <Label id="VendorBench_Label" text="VENDOR(S)/END USER COMPANIES  " required={this.props.VendorBench[0].VendorId.IsRequired} />
                    <div>
                        <ComboBox
                            id="vendorList"
                            name="vendorList"
                            onSelect={(selectedItem) => this.upsertChange(selectedItem) }
                            url="/GenericApiHelper/GetVendors"
                            dataTextField="VendorNmTxt"
                            dataValueField="VendorId"
                            placeholder="Select Vendor"
                            isEnabled= {true}
                            ></ComboBox>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-condensed">
                            <tbody>
                                {this.props.VendorBench[0].ID.Value != '0' ?
                                    this.props.VendorBench.map((Vendor: any) => (
                                        <tr  key={Vendor.ID.Value}>
                                            <td  className="text-middle" >
                                                {Vendor.VendorNmTxt.Value} ({Vendor.VendorId.Value})
                                            </td>
                                            <td>
                                                <button type="button"
                                                    className="btn btn-xs btn-custom delete-button"
                                                    onClick={() => this.removeSelectedVendor(Vendor) }
                                                    disabled={!this.props.VendorBench[0].VendorId.IsEnabled}>
                                                    <span className="icon-trash">
                                                    </span></button>
                                            </td>
                                        </tr>
                                    )
                                    )
                                    : <tr></tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    if (!state.VendorBench) {
        const { itemId } = state;
        return {
            itemId: state.itemId,
            eventEmitter: state.eventEmitter,
            VendorBench: [
                {
                    ID: { Value: '0' },
                    VendorId: { Value: '0' },
                    VendorNmTxt: { Value: '' }
                }]
        };
    }

    return {
        itemId: state.itemId,
        eventEmitter: state.eventEmitter,
        VendorBench: state.VendorBench
    };
};

export const VendorBenchContainer =
    connect(
        mapStateToProps,
        actions
    )(VendorBenchComponent as React.ClassicComponentClass<any>);

export default VendorBenchComponent;