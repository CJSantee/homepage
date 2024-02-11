
// Components
import Text from "../../components/Text";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Assets
import { faChevronLeft, faGear, faUsers, faMinus, faPlus, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
// Hooks
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Player{
  username: string,
  user_id: string|null,
  score: number,
}
interface PlayerRowProps {
  player: Player,
  active: boolean,
  editing: boolean,
  deadballs?: boolean,
}
function PlayerRow({player, active, editing, deadballs = false}:PlayerRowProps) {
  const deadballsClass = deadballs ? 'border-dashed text-muted' : '';
  const activeClass = active ? 'border-secondary' : '';

  return (
    <div className={`d-flex border ${deadballsClass} ${activeClass} rounded p-2 my-2 justify-content-between row position-relative`}>
      <div className="col-7">
        <Text size={4} className="my-2">{player.username}</Text>
      </div>
      <div className="col-5 d-flex justify-content-between align-items-center">
        <Button>
          <FontAwesomeIcon icon={faMinus} />
        </Button>
        <Text size={4}>{player.score}</Text>
        <Button>
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

  const [players] = useState<Player[]>([
    {username: "Colin", user_id: "1", score: 7},
    {username: "Thomas", user_id: "24", score: 12},
    {username: "Luke", user_id: "2", score: 8},
    {username: "Maddy", user_id: "34", score: 14},
  ]);


  return (
    <div className="container h-100 d-flex flex-column">
      
      <div className="d-flex justify-content-between align-items-center">
        <Button onClick={() => navigate('/pool')}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <Text size={5}>{title}</Text>
        <Button onClick={() => setEditing(!editing)}>
          <FontAwesomeIcon icon={editing ? faUsers : faGear} />
        </Button>
      </div>

      {players.map((player) => (
        <PlayerRow key={`player-${player.user_id}`} player={player} editing={editing} active={player.username==='Thomas'} />
      ))}

      {editing ? 
        ((players.length < 4) && <Button className="my-2">New Player</Button>)
      : <PlayerRow player={{username: 'Dead Balls', user_id: null, score: 5}} editing={false} active={false} deadballs/>}
        
      <div className="flex-fill d-flex flex-column justify-content-end">

        <div className="my-3">

          <div className="row">
            <div className="col-3">
              <div className="text-muted text-end">
                <Text size={6}>Rack</Text>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-3">
              <div className="text-muted text-end">
                <Text size={6}>DB</Text>
              </div>
            </div>
          </div>

          {players.map((player, idx) => (
            <div key={`score-${player.user_id}`} className={`row py-1 ${idx !== players.length - 1 ? 'border-bottom' : ''}`}>
              <div className="col-3">
                <Text size={5}>{player.username}</Text>
              </div>
            </div>
          ))}

        </div>

      </div>

    </div>
  )
}

export default PoolGame;
