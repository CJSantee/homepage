import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AboutMe from "./components/AboutMe";
import { Container, Row } from "react-bootstrap";
import Projects from "./components/Projects";

function Home() {
  return (
    <div>
      <Header/>
      <Container>
        <Row>
          <AboutMe />
        </Row>
        <Row>
          <Projects />
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default Home;
