import * as React from 'react';

const Loadable = (props) => {
    return (
        <div>
            {props.isLoading ? <span className="loading"></span> : props.children}
        </div>
    );
}

export default Loadable;