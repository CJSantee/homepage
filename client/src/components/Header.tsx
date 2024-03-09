// Hooks
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

// Bootstrap Components
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from 'react-bootstrap/Dropdown';

// Components
import { Link } from "react-router-dom";
import AuthContainer from "./AuthContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Assets
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useSystem } from "../hooks/useSystem";

function Header() {
  const auth = useAuth();
  const system = useSystem();
  const navigate = useNavigate();

  const signOut = () => {
    if(auth.signOut) auth.signOut();
    navigate('/');
  }
  
  return (
    <>
      <Container>
        <Navbar collapseOnSelect variant='dark' expand='md'>
          <Navbar.Brand>
            <Link to={'/'} className="nav-brand text-decoration-none">Colin<span className="text-secondary">J</span>Santee</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbarScroll' />
          <Navbar.Collapse className='d-flex-ui my-2 justify-content-between'>
            <Nav className="d-flex flex-row align-items-end">
              <Nav.Item className="me-2">
                <Link to={'/#AboutMe'} className="nav-link text-secondary" reloadDocument>
                  About Me
                </Link>
              </Nav.Item>
              <Nav.Item className="me-2">
                <Link to={'/#Projects'} className="nav-link text-secondary" reloadDocument>
                  Projects
                </Link>
              </Nav.Item>
            </Nav>
            <Nav className="align-items-end">
              {auth?.user ? (
                <Nav.Item>
                  <Dropdown as={ButtonGroup}>
                    <Button onClick={() => navigate(`/users/${auth.user?.username}`)}>{auth.user.username}</Button>
                    <Dropdown.Toggle split />
                    <Dropdown.Menu className="bg-card" align={"end"}>
                      <AuthContainer permission="admin">
                        <Dropdown.Item onClick={() => navigate('/admin')}>Admin Console</Dropdown.Item>
                      </AuthContainer>
                      <AuthContainer permission="pool">
                        <Dropdown.Item onClick={() => navigate('/pool')}>Pool</Dropdown.Item>
                      </AuthContainer>
                      <AuthContainer permission="admin">
                        <Dropdown.Item onClick={() => navigate('/message')}>Message</Dropdown.Item>
                        <Dropdown.Item onClick={() => navigate('/wordle')}>Wordle</Dropdown.Item>
                      </AuthContainer>
                      <Dropdown.Item onClick={signOut}>Sign Out</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav.Item>
              ) : (
                <Nav.Item className="position-relative">
                  <Button onClick={() => navigate('/signin')} variant='outline-secondary'>Sign In</Button>
                  {system.offline && <FontAwesomeIcon className="position-absolute top-0 end-0 mt-n2 me-n2 w-auto text-danger" icon={faCircleExclamation}/>}
                </Nav.Item>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </>
  );
}

export default Header;
