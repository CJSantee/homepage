import Text from "../../../components/Text";
import { Player } from "../../../@types/pool";

interface ScoreBoardProps {
  players: Player[],
  game_type: '9-Ball'|'8-Ball'
}
function ScoreBoard({players, game_type}:ScoreBoardProps) {
  const humanPlayers = players.filter(u => u.user_id);
  const numRacks = players?.[0]?.racks?.length || 0;

  const playersBorderClass = (index: number): string => {
    // 9-Ball has the dead balls player 
    const lastPlayerIdx = players.length - (game_type === '9-Ball' ? 2 : 1);
    if(index !== lastPlayerIdx) {
      return 'border-bottom';
    }
    return '';
  }

  return (
    <div className="flex-fill d-flex flex-column justify-content-end">
      {players.length &&
        <div className="my-3">
          <div className="row">
            <div className="col-3 text-break">
              <Text size={6} position="end" className="pe-1" muted>Rack</Text>
              {game_type === '9-Ball' && (
                <Text size={6} position="end" className="pe-1" muted>DB</Text>
              )}
              {humanPlayers.map((player, idx) => (
                <Text key={`player-${idx}-username`}
                  size={5} 
                  className={`py-1 pe-1 ${playersBorderClass(idx)}`}>{player.username}</Text>
              ))}
            </div>
            <div className="col-7 row flex-nowrap overflow-scroll no-scrollbar">
              {new Array(numRacks).fill(0).map((_, rackIdx) => (
                <div key={`rack-${rackIdx}-number`} className="d-flex flex-column w-auto min-w-2rem">
                  <Text size={6} position="center" muted>{rackIdx + 1}</Text>
                  {game_type === '9-Ball' && (
                    <Text size={6} position="center" muted>{players[players.length - 1].racks[rackIdx]}</Text>
                  )}
                  {humanPlayers.map((player, playerIdx) => (
                    <Text size={5} position="center" className={`px-2 py-1 ${playersBorderClass(playerIdx)}`}>{player.racks[rackIdx]}</Text>
                  ))}
                </div>
              ))}
              {numRacks < 8 && new Array(8 - numRacks).fill(0).map((_, idx) => (
                <div key={`filler-${idx}`} className="d-flex flex-column w-auto min-w-2rem">
                  <Text size={6} hide>.</Text>
                  {game_type === '9-Ball' && (
                    <Text size={6} hide>.</Text>
                  )}
                  {humanPlayers.map((_, pIdx) => (
                    <Text size={5} className={`px-2 py-1 ${playersBorderClass(pIdx)}`}>
                      <span className="opacity-0">.</span>
                    </Text>
                  ))}
                </div>
              ))}
            </div>
            <div className="col-2">
              <Text size={6} hide>.</Text>
              {game_type === '9-Ball' && (
                <Text size={6} hide>.</Text>
              )}
              {humanPlayers.map((player, idx) => (
                <div className="d-flex w-100 justify-content-end align-items-end">
                  <Text size={5} className={`py-1 w-100 ${playersBorderClass(idx)}`}>
                    <span className="opacity-0">.</span>
                  </Text>
                  <Text size={6} position="end" className={`py-1 ${playersBorderClass(idx)}`} muted>
                    ({player.handicap})
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default ScoreBoard;
