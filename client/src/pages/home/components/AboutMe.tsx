// Bootstrap Components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

function AboutMe() {
  return (
    <Row className='section justify-content-center' id='AboutMe'>
      <Col md>
        <h2 className='text-primary'>About Me</h2>
        <p>Hi! I'm Colin.</p>
        <p>
          I'm a creative and technically minded software developer inspired by
          software solutions with significant societal impact. I'm passionate
          about projects in web engineering, mobile applications, and full-stack
          development.
        </p>
        {/* <Button variant='outline-primary' href={API_URL}>
          Resume
        </Button> */}
      </Col>
      <Col md>
        <Row className='justify-content-center'>
          <div className='graphic' />
        </Row>
      </Col>
    </Row>
  );
}


export default AboutMe;
