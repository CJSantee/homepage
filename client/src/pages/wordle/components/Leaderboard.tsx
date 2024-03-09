import { useEffect, useState } from "react";
import api from "../../../utils/api";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import { LeaderboardEntry } from "../../../@types/wordle";

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
    <div>
      <div className="d-flex justify-content-between mb-2 px-3">
        <div className="fw-bold">Username</div>
        <Badge bg='secondary' pill>Average Guess</Badge>
      </div>
      <ListGroup as="ol" numbered>
        {leaderboard.map(user => (
          <ListGroup.Item key={user.user_id} as="li" className="d-flex justify-content-between align-items-center">
            <div className="ms-2 me-auto">
              <div className="fw-bold">{user.username}</div>
            </div>
            <Badge bg='secondary' pill>{Number(user.average_guesses).toFixed(2)}</Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

export default Leaderboard;
