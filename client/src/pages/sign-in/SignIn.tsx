// Components
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
// Hooks
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
    const {success: signedIn} = await auth.signIn({username, password, rememberMe: true});
    if(signedIn) {
      navigate('/');
    } else {
      setInvalidUsername(true);
      setInvalidPassword(true);
      setErrorMessage('Username or password is incorrect.');
    }
  };

  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col-4 p-3 border rounded min-w-300px'>
          <Form noValidate>
            <Form.Group className='mb-3'>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type='text' 
                value={username} 
                onChange={(e) => {setUsername(e.target.value); setInvalidUsername(false);}} 
                isInvalid={invalidUsername}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => {setPassword(e.target.value); setInvalidPassword(false)}} 
                  isInvalid={invalidPassword}
                />
                {!!password.length && (<Button onClick={() => setShowPassword(!showPassword)} className='view-password-btn'>{showPassword ? 'Hide' : 'Show'}</Button>)}
              </InputGroup>
            </Form.Group>
            {errorMessage && <div className='invalid-feedback d-block mb-3'>
              {errorMessage}
            </div>}
            <Form.Group className='d-flex justify-content-end mt-4'>
              <Button onClick={signIn} className='w-100'>Sign In</Button>
            </Form.Group>
          </Form>
        </div>
      </div>

      <div className='row justify-content-center mt-3'>
        <div className='col-4 p-3 border rounded min-w-300px text-center'>
          <p className='m-0'>Don't have an account?</p>
          <Button onClick={() => navigate('/signup')} className="text-secondary" variant='link'>Sign Up Here</Button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
