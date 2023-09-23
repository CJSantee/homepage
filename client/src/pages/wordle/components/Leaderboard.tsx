import { useEffect, useState } from "react";
import api from "../../../utils/api";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import { LeaderboardEntry } from "../../../../@types/wordle";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const getLeaderboard = async () => {
    const {data, success} = await api.get('/wordle/leaderboard');
    if(success) {
      setLeaderboard(data);
    }
  }
  
  useEffect(() => {
    getLeaderboard();
  }, []);

  return (
    <ListGroup as="ol" numbered>
      {leaderboard.map(user => (
        <ListGroup.Item as="li" className="d-flex justify-content-between align-items-center">
          <div className="ms-2 me-auto">
            <div className="fw-bold">{user.username}</div>
          </div>
          <Badge bg='secondary' pill>{Number(user.average_guesses).toFixed(2)}</Badge>
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}

export default Leaderboard;
