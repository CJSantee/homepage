// Hooks
import { useState } from "react";
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from "react-router-dom";
// Components
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function SignUp() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [invalidUsername, setInvalidUsername] = useState(false);

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [code, setCode] = useState('');
  const [invalidCode, setInvalidCode] = useState(false);
  const [invalidCodeMessage, setInvalidCodeMessage] = useState('');

  const signUp = async () => {
    if(!code) {
      setInvalidCode(true);
      setInvalidCodeMessage('A referral code is required to create an account.');
      return;
    }
    if(!username || !password) {
      setInvalidUsername(!username);
      setInvalidPassword(!password);
      setErrorMessage(!username ? 'Username is required.' : 'Password is required.');
      return;
    }
    if(!auth.signUp) return; // make TypeScript happy
    const {success: signedUp, error} = await auth.signUp({username, password, code});
    if(signedUp) {
      navigate('/');
    } else {
      const {code, message} = error;
      if(code === 'INVALID_CODE') {
        setInvalidCode(true);
        setInvalidCodeMessage(message);
      } else if(code === 'USERNAME_IN_USE') {
        setInvalidUsername(true);
        setErrorMessage(message);
      } else {
        setErrorMessage(message);
      }
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-4 p-3 border rounded min-w-300px">
          <Form noValidate>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type='text'
                value={username}
                onChange={(e) => {setUsername(e.target.value); setInvalidUsername(false)}}
                isInvalid={invalidUsername}
              />
            </Form.Group>
            <Form.Group className="mb-3">
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
              <Button onClick={signUp} className="w-100">Sign Up</Button>
            </Form.Group>
          </Form>
        </div>
      </div>
      <div className="row justify-content-center mt-3">
        <div className="col-4 p-3 border rounded min-w-300px">
          <Form.Group className="mb-3">
            <Form.Label>Referral Code</Form.Label>
            <Form.Control
              type='text'
              value={code}
              onChange={(e) => {setCode(e.target.value); setInvalidCode(false)}}
              isInvalid={invalidCode}
            />
          </Form.Group>
          {invalidCode && <div className='invalid-feedback d-block'>
            {invalidCodeMessage}
          </div>}
        </div>
      </div>
    </div>
  )
}

export default SignUp;
