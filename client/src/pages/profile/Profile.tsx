// Hooks
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useConfirm } from "../../hooks/useConfirm";
import { useAuth } from "../../hooks/useAuth";
import { useAlert } from "../../hooks/useAlert";
// Components
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Text from "../../components/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Utils
import api from "../../utils/api";
// Types
import { User } from "../../@types/auth";
// Assets
import { faCheck, faEdit, faUserCircle } from "@fortawesome/free-solid-svg-icons";

function Profile() {
  const { username } = useParams();
  const auth = useAuth();
  const alertManager = useAlert();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const [user, setUser] = useState<User|null>(null);
  const [editUser, setEditUser] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { success, data } = await api.get(`/users/${username}`);
      if (success) {
        setUser(data);
        setNewUsername(data.username);
      }
    }
    getUser();
  }, [username]);

  const deleteUser = async () => {
    if(!user) {
      return;
    }
    const {success} = await api.delete(`/users/${user.username}`);
    if(success && typeof auth.signOut === 'function') {
      auth.signOut();
      navigate('/');
    }
  }

  const updateUser = async (field: string) => {
    if(!user) {
      return;
    }
    // Validate
    if(field === 'username' && !newUsername) {
      return;
    }
    if(field === 'password' && !newPassword) {
      return;
    }
    const body = field === 'username' ? {
      username: newUsername
    } : {
      oldPassword,
      newPassword,
    };
    const {success, data, error} = await api.patch(`/users/${user.username}`, body);
    if(success) {
      setUser(data);
      if(typeof auth.setUser === 'function') {
        auth.setUser(data);
      }
      if(typeof alertManager.addAlert === 'function') {
        alertManager.addAlert({type: 'success', message: 'User Updated', timeout: 1000});
      }
      setEditUser(false);
    } else if(error) {
      if(typeof alertManager.addAlert === 'function') {
        alertManager.addAlert({type: 'warning', message: error.message, timeout: 3000});
      }
    }
  }

  return (
    <div className="container d-flex flex-column flex-fill">
      {user && (
        <>
        <div className="d-flex justify-content-between align-items-end mb-2">
          {editUser 
            ? <InputGroup className="h-100 me-4">
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faUserCircle} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
                <Button onClick={() => updateUser('username')}>
                  <FontAwesomeIcon icon={faCheck} />
                </Button>
              </InputGroup>
            : <Text size={2}><FontAwesomeIcon icon={faUserCircle} className="me-2"/>{user.username}</Text>
          }
          
          <Button onClick={() => setEditUser(!editUser)}>
            <FontAwesomeIcon icon={faEdit}/>
          </Button>
        </div>
        <div className="flex-fill">

          <div className="p-3 border rounded min-w-300px">
            <Form noValidate>
              <Form.Group className="mb-3">
                <Form.Label>Old Password</Form.Label>
                <Form.Control 
                  type='password'
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type='password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Button className="w-100" variant="outline-primary"
                  onClick={() => updateUser('password')}
                >Update Password</Button>
              </Form.Group>
            </Form>
          </div>

        </div>
        <div className="d-flex mt-2 mb-4">
          <Button onClick={() => {
            if(confirm) confirm(
              () => deleteUser(), // onConfirm
              () => {},                       // onCancel
              'Are you sure?',                // header
              'Do you really want to delete this user? This process cannot be undone.' // body
            );
            }} className="w-100" variant="outline-danger">
            Delete Account
          </Button>
        </div>
        </>
      )}
    </div>
  )
}

export default Profile;
