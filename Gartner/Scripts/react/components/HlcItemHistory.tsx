import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as actions from '../actions/genericActions';
import { connect } from 'react-redux';
import { ComponentDescriptor } from '../models/generic';

export interface HlcItemHistoryProps {
    HlcItemHistory: Object;
    componentDescriptor: ComponentDescriptor;
}

export const HlcItemHistoryComponent = React.createClass<HlcItemHistoryProps, any>({
    componentWillMount() {

        this.componentDescriptor = {
            name: "HlcItemHistory",
            returnObjectIndexed: true,
            stateFunction:
                '(objectAssign.default({}, state, { HlcItemHistory: action.newObject[0][0]});)',
            dataDictionary: {
                ItemId: ''
            }
        }

        this.componentDescriptor.dataDictionary["ItemId"] = this.props.itemId;
        this.props.componentData(this.componentDescriptor, 'GetItemHistory');
    },



    getFormattedDate(date: string) {
        let dt = new Date(date);

        let formattedDate = new Intl.DateTimeFormat('en-GB', {
            year: 'numeric',
            month: 'long',
            day: '2-digit', 
            hour: 'numeric', 
            minute: 'numeric'
        }).format(dt);

        return formattedDate.toString();
    },

render() {
        const itemHistoryList = this.props.HlcItemHistory.HlcItemHistoryObject;

        return (
            <div  className="row">
                <div>
                    <h2>{itemHistoryList.length > 0 ? this.props.HlcItemHistory.ItemTitle + " (" + this.props.itemId + ")" : ""}</h2>
                    <hr />
                    <br />
                </div>
                <div  className="col-xs-12 col-sm-12 col-md-8">
                    <table id="HlcItemHisotryTable">
                        <thead>
                        <tr>
                            <th style={{ width: '180px', textAlign: 'left' }}>Date/Time</th>
                            <th style={{ width: '150px', textAlign: 'left' }}>Changed By</th>
                            <th style={{ width: '150px', textAlign: 'left' }}>Category</th>
                            <th style={{ width: '150px', textAlign: 'left' }}>Field</th>
                            <th style={{ textAlign: 'left' }}>New Value</th>
                            <th style={{ textAlign: 'left' }}>Old Value</th>
                        </tr>
                        </thead>
                        <tbody>
                        {itemHistoryList.length > 0 ? 
                            itemHistoryList.map(
                                (item: any) => (
                                    (item.Items.map(
                                        (childItem) => (
                                            (childItem.Items.map(
                                                (subItem: any, index, items) => (
                                                    index === 0 ?
                                                        <tr key={subItem.HistoryId.toString() + index.toString() } id={subItem.HistoryId.toString() + index.toString() } >
                                                            <td style={{ width: '180px', verticalAlign: 'top' }} rowSpan={items.length}>{ this.getFormattedDate(subItem.Timestamp) }</td>
                                                            <td style={{ width: '150px', verticalAlign: 'top' }} rowSpan={items.length}>{subItem.EmployeeName}</td>
                                                            <td style={{ width: '150px', verticalAlign: 'top' }} rowSpan={items.length}>{subItem.CategoryName}</td>
                                                            <td style={{ width: '150px' }}>{subItem.FieldName}</td>
                                                            <td>{subItem.NewValue}</td>
                                                            <td>{subItem.OldValue}</td>
                                                        </tr>
                                                        :
                                                        <tr>
                                                            <td style={{ width: '150px' }}>{subItem.FieldName}</td>
                                                            <td>{subItem.NewValue}</td>
                                                            <td>{subItem.OldValue}</td>
                                                        </tr>
                                    )))))
                                    )))
                            : <tr></tr> 
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    if (!state.HlcItemHistory) {
        const { itemId } = state;

        return {
            itemId: state.itemId,
            HlcItemHistory: {
                HlcItemHistoryObject: []
            }
        };
    }

    return {
        itemId: state.itemId,
        HlcItemHistory: state.HlcItemHistory
    };
};

export const HlcItemHistoryContainer =
    connect(
        mapStateToProps,
        actions
    )(HlcItemHistoryComponent as React.ClassicComponentClass<any>);
  

export default HlcItemHistoryComponent;


