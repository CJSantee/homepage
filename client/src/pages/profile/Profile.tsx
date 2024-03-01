import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import api from "../../utils/api";
import { useConfirm } from "../../hooks/useConfirm";
import { useAuth } from "../../hooks/useAuth";
import Text from "../../components/Text";
import { User } from "../../@types/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faUser, faUserCircle, faUserEdit } from "@fortawesome/free-solid-svg-icons";
import Form from "react-bootstrap/Form";

function Profile() {
  const { username } = useParams();
  const auth = useAuth();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const [user, setUser] = useState<User|null>(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { success, data } = await api.get(`/users/${username}`);
      if (success) {
        setUser(data);
      }
    }
    getUser();
  }, []);

  const deleteUser = async () => {
    const {success} = await api.delete(`/users/${username}`);
    if(success && typeof auth.signOut === 'function') {
      auth.signOut();
      navigate('/');
    }
  }

  return (
    <div className="container d-flex flex-column flex-fill">
      {user && (
        <>
        <div className="d-flex justify-content-between align-items-end mb-2">
          <Text size={2}><FontAwesomeIcon icon={faUserCircle} className="me-2"/>{user.username}</Text>
          
          <Button>
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
                <Button className="w-100" variant="outline-primary">Update Password</Button>
              </Form.Group>
            </Form>
          </div>

        </div>
        <div className="d-flex my-2">
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
