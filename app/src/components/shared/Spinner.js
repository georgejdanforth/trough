import React from 'react';
import { mdiLoading } from '@mdi/js';
import { Icon } from '@mdi/react';

import './Spinner.css';


const Spinner = props => (
    <div className={'spinner'}>
        <Icon
            path={mdiLoading}
            color={props.color}
            size={props.size}
            spin={0.5}
        />
    </div>
);


export default Spinner;
