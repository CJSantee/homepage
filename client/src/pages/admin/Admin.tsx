import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import api from "../../utils/api";
import { User } from "../../../@types/auth";
import NewUserModal from "../../components/NewUserModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useConfirm } from "../../hooks/useConfirm";

function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [showNewUserModal, setShowNewUserModal] = useState(false);

  const confirm = useConfirm();

  const deleteUser = async (user_id: string) => {
    console.log('DELETE', user_id);
  }

  const updateUsers = async () => {
    const {data, success} = await api.get('/users');
    if(success) {
      setUsers(data.users);
    }
  }

  useEffect(() => {
    updateUsers();
  }, []);

  return (
    <>
      <Container>
        <h2>Users</h2>
        <ListGroup className="mb-2">
          {users.map(user => (
            // TODO: Convert to Accordions
            <ListGroup.Item key={user.user_id} className="d-flex justify-content-between align-items-center">
              <span>{user.username}</span>
              <Button onClick={() => {
                if(confirm) confirm(
                  () => deleteUser(user.user_id), // onConfirm
                  () => {},                       // onCancel
                  'Are you sure?',                // header
                  'Do you really want to delete this user? This process cannot be undone.' // body
                );
              }}>
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Button onClick={() => setShowNewUserModal(true)}>Add User</Button>
      </Container>
      <NewUserModal 
        show={showNewUserModal}
        onHide={() => {setShowNewUserModal(false); updateUsers();}} 
      />
    </>
  )
}

export default Admin;
