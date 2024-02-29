// Hooks
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Utils
import api from "../../utils/api";
// Components
import Button from "react-bootstrap/Button";
import { Badge, ListGroup } from "react-bootstrap";
import { User } from "../admin/Admin";
import Text from "../../components/Text";
import { Player } from "../../@types/pool";
import PlayerRow from "./Components/PlayerRow";

function PoolGameUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  const [page, setPage] = useState('confirmPlayers');

  useEffect(() => {
    const getAllUsers = async () => {
      const {data, success} = await api.get('/users?acl=pool');
      if(success) {
        setUsers(data.users);
      }
    }
    getAllUsers();
  }, []);

  const toggleSelected = (user: User) => {
    let newUsers: User[] = [...selectedUsers];
    if(selectedUsers.find(u => u.user_id === user.user_id)) {
      newUsers = selectedUsers.filter(u => u.user_id !== user.user_id);
    } else if(selectedUsers.length === 4) {
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
    if(page === 'confirmPlayers') {
      const newPlayers = selectedUsers.map((user) => {
        const {username, user_id} = user;
        return {
          username,
          user_id, 
          racks: [],
          total: 25,
          remaining: 25,
          handicap: 25,
          winner: false, 
        }
      });
      setPlayers(newPlayers);
      setPage('setHandicaps');
    } else {
      startGame();
    }
  }

  return (
    <div className="container h-100 d-flex flex-column">
      <Text size={5} className="mb-3">{page === 'confirmPlayers' ? 'Select Players' : 'Update Handicaps'}</Text>
      {page === 'confirmPlayers' 
        ? (
          <ListGroup className="mb-3">
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
  );
}

export default PoolGameUsers;
