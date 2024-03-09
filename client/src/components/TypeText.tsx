import { useEffect, useState } from "react";

interface Props {
  children: string,
}  
let timer: NodeJS.Timer;
function TypeText({children}:Props) {
  const [displayText, setDisplayText] = useState('');

  const typeText = () => {
    let i = -1;
    timer = setInterval(() => {
      i++;
      if(i === children.length - 1) {
        clearInterval(timer);
        setTimeout(() => {
          deleteText();
        }, 5000);
      }
      setDisplayText((prev) => prev + children[i]);
    }, 80);
  }

  const deleteText = async () => {
    let i = children.length;
    timer = setInterval(() => {
      i--;
      if(i === -1) {
        clearInterval(timer);
        setTimeout(() => {
          typeText();
        }, 500);
      } else {
        setDisplayText((prev) => prev.substring(0, i));
      }
    }, 50);
  }

  useEffect(() => {
    typeText();

    return () => {
      clearInterval(timer);
    };
  }, []);
  
  return (
    <p>{displayText}<span className="blink">|</span></p>
  );
}

export default TypeText