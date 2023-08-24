import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function LoginModal({show, onHide}:{show: boolean, onHide: any}) {
  return (
    <Modal show={show} fullscreen={"md-down"} onHide={onHide}>
      <Modal.Header closeButton={true} className='border-0 pb-0'>
        <h4 className='text-primary m-0'>Login</h4>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className='mb-2'>
            <Form.Label>Username</Form.Label>
            <Form.Control type='text'/>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password'/>
          </Form.Group>
          <Form.Group className='d-flex justify-content-end'>
            <Button>Login</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal> 
  );
}

export default LoginModal;