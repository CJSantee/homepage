import { useSystem } from "../../../hooks/useSystem";
// Bootstrap Components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {ReactComponent as DeskImg} from "../../../assets/img/ColinAtDesk.svg";
import {ReactComponent as Cloud1} from "../../../assets/img/Cloud1.svg";
import {ReactComponent as Cloud2} from "../../../assets/img/Cloud2.svg";
import {ReactComponent as Cloud3} from "../../../assets/img/Cloud3.svg";
import TypeText from "../../../components/TypeText";

function AboutMe() {
  const system = useSystem();

  return (
    <Row className='section justify-content-center' id='AboutMe'>
      <Col md style={{zIndex: 1}}>
        <h2 className='text-primary'>About Me</h2>
        <TypeText>Hi! I'm Colin.</TypeText>
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
        <Row className='justify-content-center position-relative' id='clouds'>
          <div style={{zIndex: 1}}>
            <DeskImg />
          </div>
          <div className='position-absolute cloud' id='cloud1' style={{width: "45%", top: "28%", left: "29%"}}>
            <Cloud1 />
          </div>
          <div className='position-absolute cloud' id='cloud2' style={{width: "23%", top: "57%", left: "13%"}}>
            <Cloud2 />
          </div>
          <div className='position-absolute cloud' id='cloud3' style={{width: "23%", top: "55%", left: "63.5%"}}>
            <Cloud3 />
          </div>
        </Row>
      </Col>
    </Row>
  );
}

export default AboutMe;
