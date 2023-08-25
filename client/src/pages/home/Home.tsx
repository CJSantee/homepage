import Footer from "../../components/Footer";
import AboutMe from "./components/AboutMe";
import { Container, Row } from "react-bootstrap";
import Projects from "./components/Projects";

function Home() {
  return (
    <Container>
      <Row>
        <AboutMe />
      </Row>
      <Row>
        <Projects />
      </Row>
      <Footer />
    </Container>
  );
}

export default Home;
