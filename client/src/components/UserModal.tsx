import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ModalProps } from '../@types/modal';
import { useEffect, useState } from 'react';
import api from '../utils/api';
import { User } from '../@types/auth';

interface UserModalProps extends ModalProps {
  user: User|null,
}
function UserModal({user, show, onHide}:UserModalProps) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    if(user) {
      setUsername(user.username);
    } else {
      setUsername('');
    }
  }, [user]);

  const createUser = async () => {
    const {success} = await api.post('/users', {username});
    if(success) {
      onHide();
    }
  }

  const updateUser = async () => {
    if(!user) return;
    const {user_id} = user;
    const {success} = await api.patch('/users', {user_id, username});
    if(success) {
      onHide();
    }
  }

  return (
    <Modal show={show} fullscreen={"md-down"} onHide={onHide}>
      <Modal.Header className='border-0 pb-0' closeButton closeVariant='white'>
        <h4 className='text-primary m-0'>{user ? 'Update' : 'New'} User</h4>
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
            <Button onClick={user ? updateUser : createUser}>{user ? 'Update' : 'Create'}</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UserModal;
