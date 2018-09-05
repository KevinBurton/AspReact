import * as React from 'react';

interface ParentItemProps {
    title: string;
    docCode: string;
    eventCode: string;
}

const ParentItemTitle = (props: ParentItemProps) => {
    return (
        <span className="text-normal">{props.title} ({props.docCode}) {props.eventCode != null ? props.eventCode: ""}</span>
    );
};

export default ParentItemTitle;