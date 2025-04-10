import {Button, Modal} from '@mui/material'
import { ConfirmationModalProps } from '../../api'
import CloseIcon from '@mui/icons-material/Close'

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({callback, close, text, isOpen}) => {
    return (
        <Modal
            open={isOpen}
            onClose={close}
        >
        <div className="modalInner">
            <div className="modalInnerMost">
                <CloseIcon onClick={close} className="modalClose"/>
                <h3>{text}</h3>
                <Button onClick={callback}>Confirm</Button>
            </div>
        </div>
    
    </Modal>
)
}

export default ConfirmationModal;