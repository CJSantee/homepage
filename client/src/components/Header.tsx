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
import { hasPermission } from "../utils";

function Header() {
  const auth = useAuth();
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
          <Navbar.Collapse className='justify-content-between'>
            <Nav className="align-items-end">
              <Nav.Item>
                <Link to={'/#AboutMe'} className="nav-link text-secondary" reloadDocument>
                  About Me
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link to={'/#Projects'} className="nav-link text-secondary" reloadDocument>
                  Projects
                </Link>
              </Nav.Item>
            </Nav>
            <Nav className="align-items-end">
              {auth?.user ? (
                <Nav.Item>
                  <Dropdown as={ButtonGroup}>
                    <Button>{auth.user.username}</Button>
                    <Dropdown.Toggle split />
                    <Dropdown.Menu className="bg-card" align={"end"}>
                      {hasPermission('admin', auth.user.acl) && 
                        <Dropdown.Item onClick={() => navigate('/admin')}>Admin Console</Dropdown.Item>}
                      <Dropdown.Item onClick={() => navigate('/message')}>Message</Dropdown.Item>
                      <Dropdown.Item onClick={() => navigate('/wordle')}>Wordle</Dropdown.Item>
                      <Dropdown.Item onClick={signOut}>Sign Out</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav.Item>
              ) : (
                <Nav.Item>
                  <Button onClick={() => navigate('/signin')} variant='outline-secondary'>Sign In</Button>
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
