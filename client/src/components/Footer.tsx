// Bootstrap Components
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

// Assets
import GitHub from "../assets/img/GitHub.png";

function Footer() {
  return (
    // .fixed-bottom for Sticky Footer
    <Container>
      <Navbar
        variant="dark"
        className="justify-content-center align-items-center"
      >
        <Nav>
          <Nav.Link href="https://github.com/CJSantee/homepage">
            {"Developed by "}
            <img src={GitHub} alt="" width={16} />
            {" Colin Santee"}
          </Nav.Link>
        </Nav>
      </Navbar>
    </Container>
  );
}

export default Footer;
