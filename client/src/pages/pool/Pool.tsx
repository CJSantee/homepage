// Hooks
import { MouseEventHandler, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConfirm } from "../../hooks/useConfirm";
// Components
import Button from "react-bootstrap/Button";
import Text from "../../components/Text";
import Offcanvas from "react-bootstrap/Offcanvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ScoreBoard from "./Components/ScoreBoard";
// Utils
import api from "../../utils/api";
// Types
import { Player, PoolGame } from "../../@types/pool";
// Assets
import { faCircleUser, faBars } from "@fortawesome/free-solid-svg-icons";

interface Props {
  game: PoolGame,
  todayStr: string,
  deleteCb: () => void,
};
function GameRow({game, todayStr, deleteCb}:Props) {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const [showDetails, setShowDetails] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);

  const gameDateStr = new Date(game.started).toLocaleString('en-us', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'utc'
  })
  const sameDayGame = todayStr === gameDateStr;

  const onRowClick = () => {
    if(game.winner_user_id || !sameDayGame) {
      return;
    } 
    navigate(`/pool/${game.pool_game_id}`);
  }

  const onDetailsClick:MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.stopPropagation();
    if(!players.length) {
      const {data, success} = await api.get(`/pool/${game.pool_game_id}`);
      if(success) {
        setPlayers(data);
      }
    }
    setShowDetails(true);
  }

  const hideDetails = () => setShowDetails(false);

  const deleteGame = async () => {
    const {data, success} = await api.delete(`/pool/${game.pool_game_id}`);
    deleteCb();
  }

  const onDelete = () => {
    if(confirm) confirm(
      () => deleteGame(), // onConfirm
      () => {},                       // onCancel
      'Are you sure?',                // header
      'Do you really want to delete this game? This process cannot be undone.' // body
    );
  }

  return (
    <>
      <div className="border-bottom py-2" onClick={onRowClick}>
        <div className="row">
          <div className="col-9 row">
            <Text size={6} className="mb-2">
              {gameDateStr}
            </Text>
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
        <div className="container py-4 h-100">
          <div className="d-flex justify-content-end">
            <Button variant="danger" onClick={onDelete}>
              Delete Game
            </Button>
          </div>
          <div className="h-100 pb-4 d-flex">
            <ScoreBoard players={players} />
          </div>
        </div>
      </Offcanvas>
    </>
  )
}

function Pool() {
  const navigate = useNavigate();
  const [games, setGames] = useState<PoolGame[]>([]);

  const todayStr = new Date().toLocaleString('en-us', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'utc'
  });

  useEffect(() => {
    const getGames = async () => {
      const {data, success} = await api.get('/pool');
      if(success) {
        setGames(data);
      }
    }
    getGames();
  }, []);

  const onDelete = (pool_game_id: string) => {
    setGames(games.filter(g => g.pool_game_id !== pool_game_id));
  }

  return (
    <div className="container h-100 d-flex flex-column">
      {games.map((game) => (
        <GameRow key={`${game.pool_game_id}`} game={game} todayStr={todayStr} deleteCb={() => onDelete(game.pool_game_id)}/>
      ))}
      <Button className="mt-3" onClick={() => navigate('/pool/new')}>New Game</Button>      
    </div>
  )
}

export default Pool;
