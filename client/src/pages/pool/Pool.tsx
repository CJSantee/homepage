// Hooks
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
// Components
import Button from "react-bootstrap/Button";
import GameRow from "./Components/GameRow";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import SkillLevelModal from "./Components/SkillLevelModal";
// Utils
import api from "../../utils/api";
// Types
import { PlayerStats, PoolGame } from "../../@types/pool";

const MatchEfficiencyTooltip = (
  <Tooltip id="tooltip">
    <strong>Match Efficiency (ME%)</strong>
    A player’s winning percentage of total matche
  </Tooltip>
);


function Pool() {
  const socket = useSocket();
  const navigate = useNavigate();
  const [showSkillModal, setShowSkillModal] = useState(false);
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
    <>
      <div className="container h-100 d-flex flex-column">
        <hr className="mt-0 mb-2" />
        <div className="row justify-content-between">
          <div className="col-4 d-flex flex-column justify-content-start align-items-start">
            <p className="m-0 text-muted text-start">Total</p>
            <p className="m-0 fw-bold text-start">{stats.games_played} Matches</p>
          </div>
          <OverlayTrigger placement="bottom" overlay={MatchEfficiencyTooltip}>
            <div className="col-4 d-flex flex-column justify-content-start align-items-center">
              <p className="m-0 text-muted text-center">ME %</p>
              <p className="m-0 fw-bold text-center">{stats.win_percentage * 100}</p>
            </div>
          </OverlayTrigger>
          <div onClick={() => setShowSkillModal(true)} className="col-4 d-flex flex-column justify-content-start align-items-end cursor-pointer">
            <p className="m-0 text-muted text-end text-decoration-underline">Skill Level</p>
            <p className="m-0 fw-bold text-end">{stats.skill_level}</p>
          </div>
        </div>
        <Button className="mt-2" onClick={() => navigate('/pool/new')}>New Game</Button>      
        <hr className="mt-2 mb-2" />
        {games.map((game) => (
          <GameRow key={`${game.pool_game_id}`} 
          game={game} 
          todayStr={todayStr} 
          deleteCb={() => onDelete(game.pool_game_id)} 
          refreshGames={getGames} 
          />
          ))}
      </div>

      <SkillLevelModal 
        skill_level={stats.skill_level}
        show={showSkillModal} 
        onUpdate={getGames}
        onHide={() => setShowSkillModal(false)} 
      />
    </>
  )
}

export default Pool;
