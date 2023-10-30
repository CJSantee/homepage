import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignIn() {
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
      navigate('/');
    } else {
      setInvalidUsername(true);
      setInvalidPassword(true);
      setErrorMessage('Username or password is incorrect.');
    }
  };

  return (
    <div className='row justify-content-center'>
      <div className='col-4 p-3 border rounded'>
        <Form noValidate>
          <Form.Group className='mb-3'>
            <Form.Label>Username</Form.Label>
            <Form.Control className='bg-body border'
              type='text' 
              value={username} 
              onChange={(e) => {setUsername(e.target.value); setInvalidUsername(false);}} 
              isInvalid={invalidUsername}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Password</Form.Label>
            <InputGroup className="password-input-group bg-body border">
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
          <Form.Group className='d-flex justify-content-end mt-4'>
            <Button onClick={signIn} className='w-100' variant='secondary'>Sign In</Button>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}

export default SignIn;
