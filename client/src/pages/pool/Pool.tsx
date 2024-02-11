import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

function Pool() {
  const navigate = useNavigate();

  return (
    <div className="container h-100 d-flex flex-column">
      <Button onClick={() => navigate('/pool/new')}>New Game</Button>      
    </div>
  )
}

export default Pool;
