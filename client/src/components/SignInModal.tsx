import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { ReactComponent as Desk } from "../assets/img/DeskCropped.svg";
import { ModalProps } from '../@types/modal';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignInModal({show, onHide}:ModalProps) {
  const auth = useAuth();

  const [username, setUsername] = useState('');
  const [invalidUsername, setInvalidUsername] = useState(false);
  
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);

  const navigate = useNavigate();

  // Validation
  const [errorMessage, setErrorMessage] = useState('');

  const signIn = async () => {
    if(!username || !password) {
      setInvalidUsername(!username);
      setInvalidPassword(!password);
      setErrorMessage(!username ? 'Username is required.' : 'Password is required.');
      return;
    }
    if(!auth.signIn) return; // make TypeScript happy
    const signedIn = await auth.signIn({username, password, rememberMe: true});
    if(signedIn) {
      onHide();
      navigate('/');
    } else {
      setInvalidUsername(true);
      setInvalidPassword(true);
      setErrorMessage('Username or password is incorrect.');
    }
  };

  return (
    <Modal show={show} fullscreen={"md-down"} onHide={onHide}>
      <Modal.Header className='border-0 pb-0' closeButton closeVariant='white'>
        <h4 className='text-primary m-0'>Sign In</h4>
      </Modal.Header>
      <Modal.Body>
        <div className='d-flex px-5 py-3'>
          <Desk />
        </div>
        <Form noValidate>
          <Form.Group className='mb-3'>
            <Form.Label>Username</Form.Label>
            <Form.Control type='text' 
              value={username} 
              onChange={(e) => {setUsername(e.target.value); setInvalidUsername(false);}} 
              isInvalid={invalidUsername}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Password</Form.Label>
            <InputGroup className="password-input-group">
              <Form.Control type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => {setPassword(e.target.value); setInvalidPassword(false)}} 
                isInvalid={invalidPassword}
              />
              {!!password.length && (<Button onClick={() => setShowPassword(!showPassword)} className="view-password-btn">{showPassword ? 'Hide' : 'Show'}</Button>)}
            </InputGroup>
          </Form.Group>
          {errorMessage && <div className='invalid-feedback d-block'>
            {errorMessage}
          </div>}
          <Form.Group className='d-flex justify-content-end'>
            <Button onClick={signIn}>Sign In</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal> 
  );
}

export default SignInModal;