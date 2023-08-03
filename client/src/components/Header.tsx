// Bootstrap Components
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

// Assets
import GitHub from "../assets/img/GitHub.png";
import LinkedIn from "../assets/img/LinkedIn.png";

function Header() {
  return (
    <Container>
      <Navbar collapseOnSelect variant='dark' expand='md'>
        <Navbar.Brand className='text-secondary'>Colin Santee</Navbar.Brand>
        <Navbar.Toggle aria-controls='navbarScroll' />
        <Navbar.Collapse className='justify-content-between'>
          <Nav>
            <Nav.Item>
              <Nav.Link href='#AboutMe'>About Me</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href='#Projects'>Projects</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href='#Contact'>Contact</Nav.Link>
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
