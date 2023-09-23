import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface ConfirmationModalProps {
  show: boolean,
  onCancel: () => void,
  onConfirm: () => void,
  headerText?: string,
  bodyText?: string,
};
function ConfirmationModal({show, onCancel, onConfirm, headerText, bodyText}:ConfirmationModalProps) {
  return (
    <Modal show={show} fullscreen={"md-down"} onHide={onCancel}>
      {headerText && <Modal.Header className='border-0 pb-0'>
        <h4 className='text-primary m-0'>{headerText}</h4>
      </Modal.Header>}
      <Modal.Body>
        {bodyText && <div className='mb-2'>
          {bodyText}  
        </div>}
        <div className='d-flex justify-content-end'>
          <Button onClick={onCancel} className='me-2' variant='outline-light'>Cancel</Button>
          <Button onClick={onConfirm} variant='danger'>Confirm</Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ConfirmationModal;
