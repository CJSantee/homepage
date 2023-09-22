import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ModalProps } from '../../@types/modal';
import { useState } from 'react';
import api from '../utils/api';

function NewUserModal({show, onHide}:ModalProps) {
  const [username, setUsername] = useState('');

  const createUser = async () => {
    const {success} = await api.post('/users', {username});
    if(success) {
      onHide();
    }
  }

  return (
    <Modal show={show} fullscreen={"md-down"} onHide={onHide}>
      <Modal.Header className='border-0 pb-0'>
        <h4 className='text-primary m-0'>New User</h4>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate>
          <Form.Group className='mb-3'>
            <Form.Label>Username</Form.Label>
            <Form.Control 
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='d-flex justify-content-end'>
            <Button onClick={createUser}>Create</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default NewUserModal;
