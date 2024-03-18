// Hooks
import { MouseEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConfirm } from "../../../hooks/useConfirm";
// Components
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Text from "../../../components/Text";
import Offcanvas from "react-bootstrap/Offcanvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ScoreBoard from "./ScoreBoard";
// Utils
import api from "../../../utils/api";
// Types
import { Player, PoolGame } from "../../../@types/pool";
// Assets
import { faCircleUser, faBars, faX } from "@fortawesome/free-solid-svg-icons";

interface Props {
  game: PoolGame;
  todayStr: string;
  deleteCb: () => void;
  refreshGames: () => void;
}
;
function GameRow({ game, todayStr, deleteCb, refreshGames }: Props) {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const [showDetails, setShowDetails] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [tagInput, setTagInput] = useState('');

  const gameDateStr = new Date(game.started).toLocaleString('en-us', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'utc'
  });
  const sameDayGame = todayStr === gameDateStr;

  const onRowClick = () => {
    if (game.winner_user_id || !sameDayGame) {
      return;
    }
    navigate(`/pool/${game.pool_game_id}`);
  };

  const onDetailsClick: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.stopPropagation();
    if (!players.length) {
      const { data, success } = await api.get(`/pool/${game.pool_game_id}`);
      if (success) {
        setPlayers(data);
      }
    }
    setShowDetails(true);
  };

  const hideDetails = () => setShowDetails(false);

  const deleteGame = async () => {
    const { success } = await api.delete(`/pool/${game.pool_game_id}`);
    if (success) {
      deleteCb();
    }
  };

  const addTag = async () => {
    const newTags = Array.from(new Set([...game.tags, tagInput]));
    const { success } = await api.patch(`/pool/${game.pool_game_id}`, { tags: newTags });
    if (success) {
      setTagInput('');
      setShowDetails(false);
      refreshGames();
    }
  };

  const removeTag = async (tag: string) => {
    const newTags = game.tags.filter(t => t !== tag);
    const { success } = await api.patch(`/pool/${game.pool_game_id}`, { tags: newTags });
    if (success) {
      setTagInput('');
      setShowDetails(false);
      refreshGames();
    }
  };

  const onDelete = () => {
    if (confirm) confirm(
      () => deleteGame(), // onConfirm
      () => { }, // onCancel
      'Are you sure?', // header
      'Do you really want to delete this game? This process cannot be undone.' // body
    );
  };

  return (
    <>
      <div className="border-bottom py-2" onClick={onRowClick}>
        <div className="row">
          <div className="col-9 row">
            <div className="d-flex">
              <Text size={6} className="mb-2">
                {gameDateStr}
              </Text>
              {game.tags.map((tag) => (
                <small key={`tag-${tag}`}><span className="badge bg-secondary text-dark ms-2">{tag}</span></small>
              ))}
            </div>
            {game.users.map((user) => (
              <div key={`${user.user_id}`} className="col">
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faCircleUser} size="2x" />
                  <div className="ms-2">
                    <p className={`m-0 ${user.winner ? 'text-primary' : ''}`}>{user.username}</p>
                    <small><p className="text-muted m-0">{user.score} ({user.handicap})</p></small>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-3 d-flex justify-content-end align-items-start">
            <Button onClick={onDetailsClick}>
              <FontAwesomeIcon icon={faBars} />
            </Button>
          </div>
        </div>
      </div>
      <Offcanvas show={showDetails} onHide={hideDetails} placement='bottom'>
        <div className="container d-flex flex-column py-4 h-100">
          <div className="row d-flex justify-content-between">
            <div className="order-2 order-md-1 col-12 col-md-4 my-2">
              <InputGroup className="align-items-center">
                <Form.Control
                  type="text"
                  placeholder=""
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                />
                <Button variant='primary' onClick={addTag}>
                  Add Tag
                </Button>
              </InputGroup>
            </div>
            <div className="order-1 order-md-2 col-12 col-md-4 justify-content-between justify-content-md-end d-flex my-2">
              <Button
                className="me-2 text-white"
                variant="tertiary"
                onClick={() => navigate(`/pool/${game.pool_game_id}`)}>
                Edit Game
              </Button>
              <Button variant="danger" onClick={onDelete}>
                Delete Game
              </Button>
            </div>
          </div>
          <div className="d-flex py-3">
            {game.tags.map((tag) => (
              <div key={`edit-tag-${tag}`}
                className="border border-secondary py-2 px-3 me-3 rounded-pill"
                onClick={() => removeTag(tag)}
              >
                <span>{tag}</span>
                <FontAwesomeIcon className="ms-2" icon={faX} />
              </div>
            ))}
          </div>
          <ScoreBoard players={players} />
        </div>
      </Offcanvas>
    </>
  );
}

export default GameRow;
