import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faGear, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import Text from "../../components/Text";
import { useState } from "react";

interface Player{
  username: string,
  score: number,
}
interface PlayerRowProps {
  player: Player,
  active: boolean,
  deadballs?: boolean,
}
function PlayerRow({player, active, deadballs = false}:PlayerRowProps) {
  const deadballsClass = deadballs ? 'border-dashed text-muted' : '';
  const activeClass = active ? 'border-secondary' : '';

  return (
    <div className={`d-flex border ${deadballsClass} ${activeClass} rounded p-2 my-2 justify-content-between row`}>
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
    </div>
  );
}

function Pool() {
  const [title] = useState("01/04/2024");

  const [players] = useState<Player[]>([
    {username: "Colin", score: 7},
    {username: "Thomas", score: 12},
    {username: "Luke", score: 8},
    {username: "Maddy", score: 14},
  ]);


  return (
    <div className="container h-100 d-flex flex-column">
      
      <div className="d-flex justify-content-between align-items-center">
        <Button>
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <Text size={5}>{title}</Text>
        <Button>
          <FontAwesomeIcon icon={faGear} />
        </Button>
      </div>

      {players.map((player) => (
        <PlayerRow player={player} active={player.username==='Thomas'} />
      ))}

      <PlayerRow player={{username: 'Dead Balls', score: 5}} active={false} deadballs/>
        
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
            <div className={`row py-1 ${idx !== players.length - 1 ? 'border-bottom' : ''}`}>
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

export default Pool;
