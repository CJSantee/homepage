// Bootstrap Components
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

// Components
import { Link } from "react-router-dom";

// Assets
import GitHub from "../assets/img/GitHub.png";
import LinkedIn from "../assets/img/LinkedIn.png";

function Header() {
  return (
    <Container>
      <Navbar collapseOnSelect variant='dark' expand='md'>
        <Navbar.Brand className='text-secondary'>
          <Link to={'/'} className="nav-brand text-secondary text-decoration-none">Colin Santee</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='navbarScroll' />
        <Navbar.Collapse className='justify-content-between'>
          <Nav>
            <Nav.Item>
              <Link to={'/#AboutMe'} className="nav-link" reloadDocument>
                About Me
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link to={'/#Projects'} className="nav-link" reloadDocument>
                Projects
              </Link>
            </Nav.Item>
            <Nav.Item>
            <Link to={'/#Contact'} className="nav-link" reloadDocument>
                Contact
              </Link>
            </Nav.Item>
          </Nav>
          <Nav className='social'>
            <Nav.Item className='m-2'>
              <Nav.Link href='https://github.com/CJSantee'>
                <img src={GitHub} alt='GitHub' width={24} />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className='m-2'>
              <Nav.Link href='https://www.linkedin.com/in/colin-santee/'>
                <img src={LinkedIn} alt='GitHub' width={24} />
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
}

export default Header;
