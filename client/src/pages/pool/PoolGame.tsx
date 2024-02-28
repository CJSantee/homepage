// Components
import Text from "../../components/Text";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Assets
import { faChevronLeft, faGear, faUsers, faMinus, faPlus, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
// Hooks
import { MouseEventHandler, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";
// Types
import { Player } from "../../@types/pool";
import ScoreBoard from "./Components/ScoreBoard";

interface PlayerRowProps {
  player: Player,
  active: boolean,
  editing: boolean,
  togglePlayer: (user_id: string) => void,
  updatePlayerScore: (user_id: string|null, action: string) => void,
  deadballs?: boolean,
}
function PlayerRow({player, active, editing, togglePlayer, updatePlayerScore, deadballs = false}:PlayerRowProps) {
  const deadballsClass = deadballs ? 'border-dashed text-muted' : '';
  let activeClass = '';
  if(active) {
    activeClass = 'border-secondary';
  }
  if(player.winner) {
    activeClass = 'border-primary';
  }

  const onMinusClick:MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    updatePlayerScore(player.user_id, 'subtract');
  }

  const onPlusClick:MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    updatePlayerScore(player.user_id, 'add');
  }

  return (
    <div className={`d-flex border ${deadballsClass} ${activeClass} rounded p-2 my-2 justify-content-between row position-relative`}
      onClick={() => {
        if(player.user_id) togglePlayer(player.user_id)
      }}
    >
      <div className="col-7">
        <Text size={4} className="my-2">{player.username}</Text>
      </div>
      <div className="col-5 d-flex justify-content-between align-items-center">
        <Button onClick={onMinusClick}>
          <FontAwesomeIcon icon={faMinus} />
        </Button>
        <Text size={4}>{player.total}</Text>
        <Button onClick={onPlusClick}>
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      </div>
      {editing && 
        <span className="position-absolute top-0 end-0 mt-n2 me-n2 w-auto text-danger">
          <FontAwesomeIcon size={"lg"} icon={faMinusCircle} />
        </span>}
    </div>
  );
}


function PoolGame() {
  const { pool_game_id } = useParams();
  const navigate = useNavigate();
  const [title] = useState(new Date().toLocaleDateString());
  const [editing, setEditing] = useState(pool_game_id === 'new');

  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayer, setActivePlayer] = useState<null|string>(null);

  useEffect(() => {
    const getGameData = async () => {
      const {data, success} = await api.get(`/pool/${pool_game_id}`);
      if(success) {
        setPlayers(data);
      }
    };
    getGameData();
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
    const currentPlayer = players.find(p => p.user_id == user_id);
    // Favoring reability over code-golf here :)
    if(winner) {
      if(currentPlayer?.user_id == winner?.user_id && action === 'subtract') {
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
