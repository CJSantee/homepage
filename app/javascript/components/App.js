import React from "react";

// Custom Components
import Header from "./Header";
import Footer from "./Footer";

// Sections
import AboutMe from "./AboutMe";
import Projects from "./Projects";

// Bootstrap Components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Contact from "./Contact";

function App() {
  return (
    <div>
      <Header />
      <Container>
        <Row>
          <AboutMe />
        </Row>
        <Row>
          <Projects />
        </Row>
        <Row>
          <Contact />
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
