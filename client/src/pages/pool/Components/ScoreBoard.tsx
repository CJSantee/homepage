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
            <div className="col-7 row">
              {players[0].racks.map((_, idx) => (
                <div key={`rack-idx-${idx}`} className="col-1 text-center text-muted">
                  <Text size={6}>{idx + 1}</Text>
                </div>
              ))}
            </div>
            <div className="col-2"/>
          </div>

          <div className="row">
            <div className="col-3 text-muted text-end">
              <Text size={6}>DB</Text>
            </div>
            <div className="col-7 row">
              {players[players.length - 1].racks.map((score, idx) => (
                <div key={`db-rack-${idx}`} className="col-1 text-center text-muted">
                  <Text size={6}>{score}</Text>
                </div>
              ))}
            </div>
            <div className="col-2"/>
          </div>

          {players.filter(u => u.user_id).map((player, idx) => (
            <div key={`score-${player.user_id}`} className={`row py-1 ${idx !== players.length - 2 ? 'border-bottom' : ''}`}>
              <div className="col-3">
                <Text size={5}>{player.username}</Text>
              </div>
              <div className="col-7 row">
                {player.racks.map((score, idx) => (
                  <div key={`player-${player.user_id}-rack_score-${idx}`} className="col-1 text-center text-muted">
                    <Text size={5}>{score}</Text>
                  </div>
                ))}
              </div>
              <div className="col-2 d-flex justify-content-end text-muted">
                <Text size={6} className="ms-2">({player.handicap})</Text>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  )
}

export default ScoreBoard;
