// Hooks
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Components
import Button from "react-bootstrap/Button";
import Text from "../../components/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Utils
import api from "../../utils/api";
// Types
import { PoolGame } from "../../../@types/pool";
// Assets
import { faCircleUser, faChevronRight } from "@fortawesome/free-solid-svg-icons";

function Pool() {
  const navigate = useNavigate();
  const [games, setGames] = useState<PoolGame[]>([]);

  useEffect(() => {
    const getGames = async () => {
      const {data, success} = await api.get('/pool');
      if(success) {
        setGames(data);
      }
    }
    getGames();
  }, []);

  return (
    <div className="container h-100 d-flex flex-column">
      {games.map((game) => (
        <div key={`${game.pool_game_id}`}
          className="border-bottom py-2 my-2"
        >
          <Text size={6}>
            {new Date(game.started).toLocaleString('en-us', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              timeZone: 'utc'
            })}
          </Text>
          <div className="row">
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
            {!game.winner_user_id && (
              <div className="col d-flex justify-content-end">
                <Button onClick={() => navigate(`/pool/${game.pool_game_id}`)}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
      <Button onClick={() => navigate('/pool/new')}>New Game</Button>      
    </div>
  )
}

export default Pool;
