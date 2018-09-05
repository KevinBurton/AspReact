import * as React from 'react';
import { Event } from '../models/event';
import objectAssign from './../utils/objectAssign';


export interface EventListProps {
	
    Code: string;
    Title: string;
    Region: string;
    FormattedStartDate: string;
   
}

const EventList = React.createClass<EventListProps, any>({
        componentDidMount() {
        },
 
    render() {
     //   console.log('Event title component', this.props);
		return (
			
				<div className="portlet-body">
					<h4>Event</h4>
                    
		            <div className="table-responsive">
						<table className="table table-condensed">
                            <tbody>
                                <tr className="text-left">
                                    {this.props.Title}
                                </tr>
                                <tr className="text-left" >
                                    {this.props.Code}
                                </tr>
							</tbody>
						</table>
					</div>
				</div>
			
		);
	}
});

export default EventList;