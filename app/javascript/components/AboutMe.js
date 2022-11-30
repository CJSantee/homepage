import React from "react";

// Assets
import Desk from "../../assets/images/Desk.svg";

// Bootstrap Components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

// API Route
const API_URL = "https://radiant-ravine-94842.herokuapp.com/resume";

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
        <Button variant='outline-primary' href={API_URL}>
          Resume
        </Button>
      </Col>
      <Col md>
        <Row className='justify-content-center'>
          <img src={Desk} alt='Software Developer at Desk' />
        </Row>
      </Col>
    </Row>
  );
}

export default AboutMe;
