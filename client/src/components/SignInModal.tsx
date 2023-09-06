import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

import {ReactComponent as Desk} from "../assets/img/DeskCropped.svg";

import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

function SignInModal({show, onHide}:{show: boolean, onHide: any}) {
  const auth = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const signIn = async () => {
    if(!auth.signIn) return; // make TypeScript happy
    const signedIn = await auth.signIn({username, password, rememberMe: true});
    if(signedIn) {
      onHide();
    }
  };

  return (
    <Modal show={show} fullscreen={"md-down"} onHide={onHide}>
      <Modal.Header closeButton={true} className='border-0 pb-0'>
        <h4 className='text-primary m-0'>Sign In</h4>
      </Modal.Header>
      <Modal.Body>
        <div className='d-flex px-5 py-3'>
          <Desk />
        </div>
        <Form noValidate>
          <Form.Group className='mb-2'>
            <Form.Label>Username</Form.Label>
            <Form.Control type='text' 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Password</Form.Label>
            <InputGroup className="password-input-group">
              <Form.Control type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                isInvalid={true}
              />
              {!!password.length && (<Button onClick={() => setShowPassword(!showPassword)} className="view-password-btn">{showPassword ? 'Hide' : 'Show'}</Button>)}
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              Username or password is incorrect.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className='d-flex justify-content-end'>
            <Button onClick={signIn}>Sign In</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal> 
  );
}

export default SignInModal;