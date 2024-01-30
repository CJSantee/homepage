import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUserPen, faPhone, faCheck, faLock } from "@fortawesome/free-solid-svg-icons";
import { User } from "../Admin";
import { useAuth } from "../../../hooks/useAuth";
import api from "../../../utils/api";
import { useState } from "react";
import { useAlert } from "../../../hooks/useAlert";

interface UserBodyProps {
  user: User,
  updateUsers: () => Promise<void>,
  onEdit: () => void,
  onDelete: () => void,
}

function UserBody({user, updateUsers, onEdit, onDelete}: UserBodyProps) {
  const [handle, setHandle] = useState('');

  const auth = useAuth();
  const alertManager = useAlert();

  const updateHandle = async () => {
    const {user_id} = user;
    if(!handle) return;
    const {success} = await api.patch('/users', {user_id, handle, protocol: 's'});
    if(success) {
      updateUsers();
    }
  }

  const inviteToTurdle = async () => {
    const {user_id} = user;
    const {success} = await api.post('/wordle/invite', {user_id});
    if(success) {
      if(alertManager.addAlert) alertManager.addAlert({type: 'success', message: `Sent Turdle invite to ${user.username}.`, timeout: 3000});
    }
  }

  return (
    <div className="row">
       <div className="col-12 col-md-3 d-flex align-items-center mb-2 mb-md-0">
        {user.handle ? (
          <div className="flex-column">
            <div className="mb-2">
              <FontAwesomeIcon icon={faPhone}/>
              <span className="ms-2 fw-bold">{user.handle}</span>
            </div>
            <div className="d-flex align-items-center">
              <span className="fs-3 me-2">💩</span>
              <Button onClick={inviteToTurdle}>Invite</Button>
            </div>
          </div>
        ) : (
          <InputGroup className="align-items-center">
            <div className="mx-2">
              <FontAwesomeIcon icon={faPhone} />
            </div>
            <Form.Control 
              type="text"
              placeholder="+16151234567"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="rounded"
            />
            <Button variant='primary' onClick={updateHandle}>
              <FontAwesomeIcon icon={faCheck} />
            </Button>
          </InputGroup>
        )}
      </div>
      <div className="col-12 col-md-9 d-flex justify-content-end align-items-start">
        <Button onClick={onEdit}>
          <FontAwesomeIcon icon={faUserPen} />
        </Button>
        <Button className="ms-2">
          <FontAwesomeIcon icon={faLock} />
        </Button>
        {user.user_id !== auth?.user?.user_id && <Button onClick={onDelete} className="ms-2">
          <FontAwesomeIcon icon={faTrash} />
        </Button>}
      </div>
    </div>
  )
}

export default UserBody;
