import Text from "../../../components/Text";
import { Player } from "../../../@types/pool";

interface ScoreBoardProps {
  players: Player[],
}
function ScoreBoard({players}:ScoreBoardProps) {
  return (
    <div className="flex-fill d-flex flex-column justify-content-end">
      {players.length &&
        <div className="my-3">
          <div className="row">
            <div className="col-3 text-muted text-end">
              <Text size={6}>Rack</Text>
            </div>
            {players[0].racks.map((_, idx) => (
              <div key={`rack-idx-${idx}`} className="col-1 text-center text-muted">
                <Text size={6}>{idx + 1}</Text>
              </div>
            ))}
          </div>

          <div className="row">
            <div className="col-3 text-muted text-end">
              <Text size={6}>DB</Text>
            </div>
            {players[players.length - 1].racks.map((score, idx) => (
              <div key={`db-rack-${idx}`} className="col-1 text-center text-muted">
                <Text size={6}>{score}</Text>
              </div>
            ))}
          </div>

          {players.filter(u => u.user_id).map((player, idx) => (
            <div key={`score-${player.user_id}`} className={`row py-1 ${idx !== players.length - 2 ? 'border-bottom' : ''}`}>
              <div className="col-3">
                <Text size={5}>{player.username}</Text>
              </div>
              {player.racks.map((score, idx) => (
                <div key={`player-${player.user_id}-rack_score-${idx}`} className="col-1 text-center text-muted">
                  <Text size={5}>{score}</Text>
                </div>
              ))}
            </div>
          ))}
        </div>
      }
    </div>
  )
}

export default ScoreBoard;
