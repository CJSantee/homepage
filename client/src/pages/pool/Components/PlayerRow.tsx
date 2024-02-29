// Types 
import { MouseEventHandler } from "react";
import { Player } from "../../../@types/pool";
// Components
import Button from "react-bootstrap/Button";
import Text from "../../../components/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Assets
import { faMinus, faPlus, faMinusCircle } from "@fortawesome/free-solid-svg-icons";

interface PlayerRowProps {
  player: Player,
  active?: boolean,
  editing?: boolean,
  togglePlayer?: (user_id: string) => void,
  updatePlayerScore: (user_id: string | null, action: string) => void,
  deadballs?: boolean,
}
function PlayerRow({ player, active = false, editing = false, togglePlayer, updatePlayerScore, deadballs = false }: PlayerRowProps) {
  const deadballsClass = deadballs ? 'border-dashed text-muted' : '';
  let activeClass = '';
  if (active) {
    activeClass = 'border-secondary';
  }
  if (player.winner) {
    activeClass = 'border-primary';
  }

  const onMinusClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    updatePlayerScore(player.user_id, 'subtract');
  }

  const onPlusClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    updatePlayerScore(player.user_id, 'add');
  }

  return (
    <div className={`d-flex border ${deadballsClass} ${activeClass} rounded p-2 my-2 justify-content-between row position-relative`}
      onClick={() => {
        if (player.user_id && togglePlayer) togglePlayer(player.user_id)
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

export default PlayerRow;

