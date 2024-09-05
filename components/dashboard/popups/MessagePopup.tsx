import React from 'react';
import style from '../../all.module.css';

interface Props {
    message: string;
    onClose: () => void;
}

const MessagePopup: React.FC<Props> = ({ message, onClose }) => {
    return (
        <div className={style.popup}>
            <div className={style.popupContent}>
                <span className={style.close} onClick={onClose}>&times;</span>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default MessagePopup;