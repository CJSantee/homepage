// Hooks
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
// Components
import Button from "react-bootstrap/Button";
import GameRow from "./Components/GameRow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Utils
import api from "../../utils/api";
// Types
import { PlayerStats, PoolGame } from "../../@types/pool";
// Assets
import { faGears } from "@fortawesome/free-solid-svg-icons";
// Assets
import Text from "../../components/Text";

function Pool() {
  const socket = useSocket();
  const navigate = useNavigate();
  const [games, setGames] = useState<PoolGame[]>([]);
  const [stats, setStats] = useState<PlayerStats>({
    games_played: 0,
    games_won: 0,
    win_percentage: 0,
    skill_level: 0,
  });

  const todayStr = new Date().toLocaleString('en-us', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'utc'
  });

  const getGames = async () => {
    const {data, success} = await api.get('/pool');
    if(success) {
      const {games, stats} = data;
      setGames(games);
      setStats(stats);
    }
  }

  useEffect(() => {
    if(typeof socket.on === 'function') {
      socket.on('games:new', () => {
        getGames();
      });
    }
    getGames();

    return () => {
      if(typeof socket.off === 'function') {
        socket.off('games:new');
      }
    }
  }, [socket]);

  const onDelete = (pool_game_id: string) => {
    setGames(games.filter(g => g.pool_game_id !== pool_game_id));
  }

  return (
    <div className="container h-100 d-flex flex-column">
      <div className="row justify-content-between">
        <div className="col-3 d-flex flex-column justify-content-center align-items-center rounded border p-2 h-100">
          <span className="fw-bold">{stats.win_percentage}</span>
          <p className="m-0 text-center">ME%</p>
        </div>
        <div className="col-3 d-flex flex-column justify-content-center align-items-center rounded border p-2 h-100 position-relative">
          <span className="fw-bold">{stats.skill_level}</span>
          <p className="m-0 text-center">Skill Level</p>
          <span className="position-absolute top-0 end-0 mt-n2 me-n2 w-auto text-primary">
            <FontAwesomeIcon size={"lg"} icon={faGears} />
          </span>
        </div>
      </div>
      {games.map((game) => (
        <GameRow key={`${game.pool_game_id}`} 
          game={game} 
          todayStr={todayStr} 
          deleteCb={() => onDelete(game.pool_game_id)} 
          refreshGames={getGames} 
        />
      ))}
      <Button className="mt-3" onClick={() => navigate('/pool/new')}>New Game</Button>      
    </div>
  )
}

export default Pool;
