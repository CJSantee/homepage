import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import api from "../../utils/api";
import UserModal from "../../components/UserModal";
import { useConfirm } from "../../hooks/useConfirm";
import UserBody from "./components/UserBody";

export interface User {
  user_id: string,
  username: string,
  acl: string,
  handle: string,
}

function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User|null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const confirm = useConfirm();

  const updateUsers = async () => {
    const {data, success} = await api.get('/users');
    if(success) {
      setUsers(data.users);
    }
  }

  const selectUser = (user: User|null) => {
    setSelectedUser(user);
    setShowUserModal(true);
  }
  
  const deleteUser = async (username: string) => {
    const {success} = await api.delete(`/users/${username}`);
    if(success) {
      updateUsers();
    }
  }

  useEffect(() => {
    updateUsers();
  }, []);

  return (
    <>
      <Container>
        <h2>Users</h2>
        <Accordion className="mb-2">
          {users.map(user => (
            <Accordion.Item key={user.user_id} eventKey={user.user_id}>
              <Accordion.Header>
                <span className="my-1">{user.username}</span>
              </Accordion.Header>
              <Accordion.Body> 
                <UserBody user={user} 
                  updateUsers={updateUsers}
                  onEdit={() => selectUser(user)} 
                  onDelete={() => {
                    if(confirm) confirm(
                      () => deleteUser(user.username), // onConfirm
                      () => {},                       // onCancel
                      'Are you sure?',                // header
                      'Do you really want to delete this user? This process cannot be undone.' // body
                    );
                  }}/>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
        <Button onClick={() => selectUser(null)}>Add User</Button>
      </Container>
      <UserModal
        user={selectedUser}
        show={showUserModal}
        onHide={() => {setShowUserModal(false); updateUsers();}} 
      />
    </>
  )
}

export default Admin;
