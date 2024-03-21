// Hooks
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Utils
import api from "../../utils/api";
// Components
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { Badge, ListGroup } from "react-bootstrap";
import Text from "../../components/Text";
import PlayerRow from "./Components/PlayerRow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserModal from "../../components/UserModal";
// Types
import { NineBallSkillLevel, Player } from "../../@types/pool";
import { User } from "../../@types/auth";
// Assets
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { POOL_HANDICAPS } from "../../utils/constants";

function PoolGameUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [gameType, setGameType] = useState('9-Ball');

  const [page, setPage] = useState('confirmPlayers');

  const getAllUsers = async () => {
    const {data, success} = await api.get('/users?acl=pool');
    if(success) {
      setUsers(data.users);
    }
  }

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if(gameType === '8-Ball' && selectedUsers.length > 2) {
      const newUsers = [selectedUsers[0], selectedUsers[1]];
      setSelectedUsers(newUsers);
    }
  }, [gameType]);

  const toggleSelected = (user: User) => {
    const maxSelected = gameType === '8-Ball' ? 2 : 4;

    let newUsers: User[] = [...selectedUsers];
    if(selectedUsers.find(u => u.user_id === user.user_id)) {
      newUsers = selectedUsers.filter(u => u.user_id !== user.user_id);
    } else if(selectedUsers.length >= maxSelected) {
      return;
    } else {
      newUsers.push(user);
    }

    setSelectedUsers(newUsers);
  }

  const startGame = async () => {
    const gamePlayers = players.map(p => ({
      user_id: p.user_id,
      handicap: p.total,
    }));
    const {data, success} = await api.post('/pool', {players: gamePlayers});

    if(success) {
      const {pool_game_id} = data;
      navigate(`/pool/${pool_game_id}`);
    }
  }

  const updatePlayerHandicap = async (user_id: string|null, action: string) => {
    const newPlayers: Player[] = players.map(player => {
      if(player.user_id !== user_id) {
        return player;
      }
      const {total: currentHandicap} = player;
      let newHandicap = currentHandicap;
      if(currentHandicap === 0 && action === 'subtract') {
        newHandicap = currentHandicap;
      } else if(currentHandicap === 100 && action === 'add') {
        newHandicap = currentHandicap;
      } else {
        newHandicap = currentHandicap + (action === 'add' ? 1 : -1);
      }
      return {
        ...player,
        total: newHandicap,
      };
    });
    setPlayers(newPlayers);
  }

  const cancel = () => {
    if(page === 'confirmPlayers') {
      navigate('/pool');
    } else {
      setPage('confirmPlayers');
    }
  }

  const confirm = () => {
    if(!selectedUsers.length) {
      return;
    }
    if(page === 'confirmPlayers') {
      if(gameType === '9-Ball') {
        const newPlayers = selectedUsers.map((user) => {
          const {username, user_id, skill_levels} = user;
          let skillLevel: NineBallSkillLevel = 3;
          if(skill_levels?.["9-Ball"]) {
            skillLevel = skill_levels["9-Ball"];
          }

          const handicap = POOL_HANDICAPS['9-Ball'][skillLevel];

          return {
            username,
            user_id, 
            racks: [],
            total: handicap,
            remaining: handicap,
            handicap,
            winner: false, 
          }
        });
        setPlayers(newPlayers);
      } else if(gameType === '8-Ball') {
        const [player, opponent] = selectedUsers;
        const playerSkillLevel = player?.skill_levels?.["8-Ball"] || 3;
        const opponentSkillLevel = opponent?.skill_levels?.["8-Ball"] || 3;

        const playerHandicap = POOL_HANDICAPS['8-Ball'][playerSkillLevel][opponentSkillLevel];
        const opponentHandicap = POOL_HANDICAPS['8-Ball'][opponentSkillLevel][playerSkillLevel];

        const newPlayers = [
          {
            username: player.username,
            user_id: player.user_id,
            racks: [],
            total: playerHandicap,
            remaining: playerHandicap,
            handicap: playerHandicap,
            winner: false, 
          },
          {
            username: opponent.username,
            user_id: opponent.user_id,
            racks: [],
            total: opponentHandicap,
            remaining: opponentHandicap,
            handicap: opponentHandicap,
            winner: false, 
          }
        ];
        setPlayers(newPlayers);
      }
      setPage('setHandicaps');
    } else {
      startGame();
    }
  }

  return (
    <>
      <div className="container h-100 d-flex flex-column">
        <ButtonGroup className="mb-3">
          <Button 
            onClick={() => setGameType('8-Ball')}
            variant={gameType !== '8-Ball' ? 'outline-primary' : 'primary'}>8-Ball</Button>
          <Button 
            onClick={() => setGameType('9-Ball')}
            variant={gameType !== '9-Ball' ? 'outline-primary' : 'primary'}>9-Ball</Button>
        </ButtonGroup>
        <div className="d-flex align-items-center justify-content-between">
          <Text size={5}>{page === 'confirmPlayers' ? 'Select Players' : 'Update Handicaps'}</Text>
          {page === 'confirmPlayers' && (
            <Button onClick={() => setShowUserModal(true)}>
              <FontAwesomeIcon icon={faUserPlus} />
            </Button>
          )}
        </div>
        {page === 'confirmPlayers' 
          ? (
            <ListGroup className="mt-2 mb-3">
              {users.map((user) => {
                const selected_idx = selectedUsers.findIndex(u => u.user_id === user.user_id);
                return (
                  <ListGroup.Item 
                    className="d-flex justify-content-between align-items-center cursor-pointer py-3"
                    key={`user-${user.user_id}`} 
                    active={selected_idx !== -1}
                    onClick={() => toggleSelected(user)}
                  >
                    <Text size={4}>
                      {user.username}
                    </Text>

                    {(selected_idx !== -1) && 
                      <Badge bg="secondary" pill>
                        {selected_idx + 1}
                      </Badge>
                    }
                  </ListGroup.Item>
                )
              })}
            </ListGroup>
          )
          : (
            <div>
              {players.map((player) =>  (
                <PlayerRow key={`player-${player.user_id}`} player={player} updatePlayerScore={updatePlayerHandicap} />
              ))}
            </div>
          )}
        <div className="row">
          <Button className="col me-1" onClick={cancel} variant="light">Cancel</Button>
          <Button className="col ms-1" onClick={confirm}>{page === 'confirmPlayers' ? 'Confirm Players' : 'Start Game'}</Button>
        </div>
      </div>
      <UserModal 
        show={showUserModal} 
        onHide={() => setShowUserModal(false)} 
        user={null}
        code="pool"
        onSuccess={getAllUsers}
      />
    </>
  );
}

export default PoolGameUsers;
