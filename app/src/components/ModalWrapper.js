import React from 'react';
import {
    Modal,
    ModalBackground,
    ModalContent,
    ModalClose
} from 'bloomer';


const ModalWrapper = (props) => (
    <Modal isActive={props.isActive}>
        <ModalBackground onClick={props.close}/>
        <ModalContent>{props.form}</ModalContent>
        <ModalClose onClick={props.close}/>
    </Modal>
);

export default ModalWrapper;

