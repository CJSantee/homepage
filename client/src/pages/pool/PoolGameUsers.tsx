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

function PoolGameUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    const getAllUsers = async () => {
      const {data, success} = await api.get('/users?acl=pool');
      if(success) {
        setUsers(data.users);
      }
    }
    getAllUsers();
  }, []);

  const toggleSelected = (user_id: string) => {
    let newUsers: string[] = [...selectedUsers];
    if(selectedUsers.includes(user_id)) {
      newUsers = selectedUsers.filter(user => user !== user_id);
    } else if(selectedUsers.length === 4) {
      return;
    } else {
      newUsers.push(user_id);
    }

    setSelectedUsers(newUsers);
  }

  const startGame = async () => {
    const pool_game_id = 1;
    navigate(`/pool/${pool_game_id}`);
  }

  return (
    <div className="container h-100 d-flex flex-column">
      <Text size={5} className="mb-3">Select Players</Text>
      <ListGroup className="mb-3">
        {users.map((user) => (
          <ListGroup.Item 
            className="d-flex justify-content-between align-items-center cursor-pointer"
            key={`user-${user.user_id}`} 
            active={selectedUsers.includes(user.user_id)}
            onClick={() => toggleSelected(user.user_id)}
          >
            {user.username}

            {selectedUsers.includes(user.user_id) && <Badge bg="secondary" pill>
              {selectedUsers.findIndex(uid => uid === user.user_id) + 1}
            </Badge>}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Button onClick={startGame}>Start Game</Button>
    </div>
  );
}

export default PoolGameUsers;
