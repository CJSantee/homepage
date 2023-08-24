import { useEffect } from "react";
// Bootstrap Components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
// import Button from "react-bootstrap/Button";
import {ReactComponent as DeskImg} from "../../../assets/img/ColinAtDesk.svg";
import {ReactComponent as Cloud1} from "../../../assets/img/Cloud1.svg";
import {ReactComponent as Cloud2} from "../../../assets/img/Cloud2.svg";
import {ReactComponent as Cloud3} from "../../../assets/img/Cloud3.svg";

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

interface AnimationElements {
  [key: string]: {
    element: HTMLElement,
    position: number,
    speed: number,
    startingPosition: {
      left: number,
      right: number,
      top: number,
      bottom: number,
    },
    row: number,
  },
};

function AboutMe() {
  useEffect(() => {
    const { innerWidth: windowWidth } = window;

    const cloud1 = document.getElementById('cloud1');
    const cloud2 = document.getElementById('cloud2');
    const cloud3 = document.getElementById('cloud3');
    const cloud4 = document.getElementById('cloud4');
    const cloud5 = document.getElementById('cloud5');
    const cloud6 = document.getElementById('cloud6');

    if(!cloud1 || !cloud2 || !cloud3 || !cloud4 || !cloud5 || !cloud6) {
      return;
    }

    const elements: AnimationElements = {
      cloud1: {
        element: cloud1,
        position: 0,
        speed: 1,
        startingPosition: cloud1.getBoundingClientRect(),
        row: 1,
      },
      cloud2: {
        element: cloud2,
        position: 0,
        speed: 3,
        startingPosition: cloud2.getBoundingClientRect(),
        row: 2,
      },
      cloud3: {
        element: cloud3,
        position: 0,
        speed: 2,
        startingPosition: cloud3.getBoundingClientRect(),
        row: 2,
      },
    };

    const maxPerRow = Math.floor(windowWidth / 400) || 1;

    console.log('max', maxPerRow);

    function animate(elements: AnimationElements) {
      const [numRowOne, numRowTwo] = Object.values(elements).reduce((num, elem) => {
        if(elem.row === 1) {
          num[0] += 1;
        } else {
          num[1] += 1;
        }
        return num;
      }, [0, 0]);

      for(const elementKey in elements) {
        const {element, position, speed, startingPosition: {left, right}, row} = elements[elementKey];
        const numOnRow = row === 1 ? numRowOne : numRowTwo;

        const screenPos = left - position;
        if(screenPos < windowWidth / maxPerRow && numOnRow < maxPerRow) {
          // Create new element
        }

        const opacity = 1 - (Math.abs(position) / right);
        if(position*-1 > right) {
          elements[elementKey].position = windowWidth - left; // shift all the way right, offscreen
          elements[elementKey].speed = getRandomInt(1, 3); // get new speed
        } else {
          elements[elementKey].position -= speed; // moving left
        }

        element.style.transform = `translate(${position}px, 0)`;
        element.style.opacity = `${opacity}`;
      }

      requestAnimationFrame(() => animate(elements));
    }

    requestAnimationFrame(() => animate(elements));
    
  }, []);

  return (
    <Row className='section justify-content-center' id='AboutMe'>
      <Col md style={{zIndex: 1}}>
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
        <Row className='justify-content-center position-relative' id='clouds'>
          <div style={{zIndex: 1}}>
            <DeskImg />
          </div>
          <div className='position-absolute' id='cloud1' style={{width: "45%", top: "28%", left: "29%"}}>
            <Cloud1 />
          </div>
          <div className='position-absolute' id='cloud2' style={{width: "23%", top: "57%", left: "13%"}}>
            <Cloud2 />
          </div>
          <div className='position-absolute' id='cloud3' style={{width: "23%", top: "55%", left: "63.5%"}}>
            <Cloud3 />
          </div>
          <div className='position-absolute d-none' id='cloud4' style={{width: "45%", top: "55%", left: "29%"}}>
            <Cloud1 />
          </div>
          <div className='position-absolute d-none' id='cloud5' style={{width: "23%", top: "28%", left: "13%"}}>
            <Cloud2 />
          </div>
          <div className='position-absolute d-none' id='cloud6' style={{width: "23%", top: "26%", left: "63.5%"}}>
            <Cloud3 />
          </div>
        </Row>
      </Col>
    </Row>
  );
}

export default AboutMe;
