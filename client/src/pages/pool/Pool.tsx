// Hooks
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
// Components
import Button from "react-bootstrap/Button";
// Utils
import api from "../../utils/api";
// Types
import { PoolGame } from "../../@types/pool";
// Assets
import GameRow from "./Components/GameRow";
import Text from "../../components/Text";

function Pool() {
  const socket = useSocket();
  const navigate = useNavigate();
  const [games, setGames] = useState<PoolGame[]>([]);

  const todayStr = new Date().toLocaleString('en-us', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'utc'
  });

  const getGames = async () => {
    const {data, success} = await api.get('/pool');
    if(success) {
      setGames(data);
    }
  }

  useEffect(() => {
    if(typeof socket.on === 'function') {
      socket.on('games:new', (game) => {
        console.log('new game', game);
        getGames();
      });
    }
    getGames();

    return () => {
      if(typeof socket.off === 'function') {
        socket.off('games:new');
      }
    }
  }, []);

  const onDelete = (pool_game_id: string) => {
    setGames(games.filter(g => g.pool_game_id !== pool_game_id));
  }

  return (
    <div className="container h-100 d-flex flex-column">
      {
        games.length > 0  
        ? games.map((game) => (
          <GameRow key={`${game.pool_game_id}`} 
            game={game} 
            todayStr={todayStr} 
            deleteCb={() => onDelete(game.pool_game_id)} 
            refreshGames={getGames} 
          />
        ))
        : (
          <div className="d-flex flex-fill align-items-center justify-content-center text-muted mb-5">
            <Text size={6}>No Games Played</Text>
          </div>
        )
      }
      <div className="container fixed-bottom">
        <Button className="w-100 my-3" onClick={() => navigate('/pool/new')}>New Game</Button>      
      </div>
    </div>
  )
}

export default Pool;
