import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
// Bootstrap Components
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

// Components
import { Link } from "react-router-dom";
import SignInModal from "./SignInModal";

function Header() {
  const [showSignIn, setShowSignIn] = useState(false);

  const auth = useAuth();

  const signOut = () => {
    if(auth.signOut) auth.signOut();
  }
  
  return (
    <>
      <Container>
        <Navbar collapseOnSelect variant='dark' expand='md'>
          <Navbar.Brand>
            <Link to={'/'} className="nav-brand text-decoration-none">Colin Santee</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbarScroll' />
          <Navbar.Collapse className='justify-content-between'>
            <Nav>
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
              <Nav.Item>
              <Link to={'/#Contact'} className="nav-link text-secondary" reloadDocument>
                  Contact
                </Link>
              </Nav.Item>
            </Nav>
            <Nav>
              {auth?.user ? (
                <Nav.Item>
                  <Button onClick={signOut} variant='outline-secondary'>Sign Out</Button>
                </Nav.Item>
              ) : (
                <Nav.Item>
                  <Button onClick={() => setShowSignIn(true)} variant='outline-secondary'>Sign In</Button>
                </Nav.Item>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
      <SignInModal show={showSignIn} onHide={() => setShowSignIn(false)}/>
    </>
  );
}

export default Header;
