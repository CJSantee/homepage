// Components
import Text from "../../components/Text";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ScoreBoard from "./Components/ScoreBoard";
import PlayerRow from "./Components/PlayerRow";
// Assets
import { faChevronLeft, faGear, faUsers } from "@fortawesome/free-solid-svg-icons";
// Hooks
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Types
import { Player } from "../../@types/pool";
// Utils
import api from "../../utils/api";
import { useSocket } from "../../hooks/useSocket";

function PoolGame() {
  const { pool_game_id } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const [title] = useState(new Date().toLocaleDateString());
  const [editing] = useState(pool_game_id === 'new');

  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayer, setActivePlayer] = useState<null|string>(null);

  useEffect(() => {
    const getGameData = async () => {
      const {data, success} = await api.get(`/pool/${pool_game_id}`);
      if(success) {
        setPlayers(data);
      }
    };
    if(typeof socket.on === 'function') {
      socket.on('game:update', () => {
        getGameData();
      });
    }
    getGameData();

    return () => {
      if(typeof socket.off === 'function') {
        socket.off('game:update');
      }
    }
  }, [pool_game_id]);

  /**
   * @description Toggle the active player
   */
  const togglePlayer = (user_id: string) => {
    if(activePlayer === user_id) {
      setActivePlayer(null);
      return;
    }
    setActivePlayer(user_id);
  }

  const updatePlayerScore = async (user_id: string|null, action: string) => {
    // If there already exists a winner, don't update the scores unless you're subtracting from their score
    const winner = players.find(p => p.winner);
    const currentPlayer = players.find(p => p.user_id === user_id);
    // Favoring reability over code-golf here :)
    if(winner) {
      if(currentPlayer?.user_id === winner?.user_id && action === 'subtract') {
        // Don't return 
      } else {
        return;
      }
    }

    const {data, success} = await api.post(`/pool/${pool_game_id}/scores/${action}`, {user_id});
    if(success) {
      setPlayers(data);
    }
  }

  return (
    <div className="container h-100 d-flex flex-column">
      
      <div className="d-flex justify-content-between align-items-center">
        <Button onClick={() => navigate('/pool')}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <Text size={5}>{title}</Text>
        <Button>
          <FontAwesomeIcon icon={editing ? faUsers : faGear} />
        </Button>
      </div>

      {players.map((player) => (
        <PlayerRow key={`player-${player.user_id}`} 
          player={player} 
          editing={editing} 
          active={!!player.user_id && player.user_id === activePlayer} 
          togglePlayer={togglePlayer}
          updatePlayerScore={updatePlayerScore}
        />
      ))}
        
      <ScoreBoard players={players} />
    </div>
  )
}

export default PoolGame;
