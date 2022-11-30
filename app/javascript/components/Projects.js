import React from "react";

// Bootstrap Components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

// Assets
import Phone from "../../assets/images/BrewablePhone.png";

function Projects() {
  return (
    <Row className='section' id='Projects'>
      <Col md className='order-md-last'>
        <h2 className='text-primary'>Projects</h2>
        <p className='text-secondary'>
          <strong>Brewable</strong>
        </p>
        <p>
          Personal project developing mobile app for coffee brewing. Designed to
          capture and improve your coffee brewing experiences.
        </p>
        <Button variant='outline-secondary' href='http://brewableapp.com'>
          Homepage
        </Button>
        <Button
          variant='outline-secondary'
          href='https://apps.apple.com/us/app/brewable/id1592801332'
          className='mx-2'
        >
          App Store
        </Button>
        <Button
          variant='outline-secondary'
          href='https://github.com/cjsantee/brewable'
        >
          Source Code
        </Button>
      </Col>
      <Col md className='order-md-first'>
        <Row className='justify-content-center'>
          <img src={Phone} alt='' style={{ width: "80%" }} />
        </Row>
      </Col>
    </Row>
  );
}

export default Projects;
