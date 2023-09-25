import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import api from "../../utils/api";
import { User } from "../../../@types/auth";
import UserModal from "../../components/UserModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUserPen } from "@fortawesome/free-solid-svg-icons";
import { useConfirm } from "../../hooks/useConfirm";
import { useAuth } from "../../hooks/useAuth";

function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User|null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const confirm = useConfirm();
  const auth = useAuth();

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
  
  const deleteUser = async (user_id: string) => {
    const {success} = await api.post('/users/archive', {user_id});
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
            // TODO: Convert to Accordions
            <Accordion.Item key={user.user_id} eventKey={user.user_id}>
              <Accordion.Header>
                <span className="my-1">{user.username}</span>
              </Accordion.Header>
              <Accordion.Body className="d-flex justify-content-end"> 
                <Button onClick={() => selectUser(user)} className="me-2">
                  <FontAwesomeIcon icon={faUserPen} />
                </Button>
                {user.user_id !== auth?.user?.user_id && <Button onClick={() => {
                  if(confirm) confirm(
                    () => deleteUser(user.user_id), // onConfirm
                    () => {},                       // onCancel
                    'Are you sure?',                // header
                    'Do you really want to delete this user? This process cannot be undone.' // body
                  );
                }}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>}
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
