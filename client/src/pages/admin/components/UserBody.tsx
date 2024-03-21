import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUserPen,faUnlock } from "@fortawesome/free-solid-svg-icons";
import { User } from "../Admin";
import { useAuth } from "../../../hooks/useAuth";
import api from "../../../utils/api";
import { useConfirm } from "../../../hooks/useConfirm";
import { useAlert } from "../../../hooks/useAlert";

interface UserBodyProps {
  user: User,
  updateUsers: () => Promise<void>,
  onEdit: () => void,
  onDelete: () => void,
}

function UserBody({user, onEdit, onDelete}: UserBodyProps) {
  const auth = useAuth();
  const confirm = useConfirm();
  const alertManager = useAlert();


  const resetPassword = async () => {
    const {success} = await api.patch('/users', {user_id: user.user_id, newPassword: ''});
    if(success && typeof alertManager.addAlert === 'function') {
      alertManager.addAlert({type: 'success', message: 'Password Reset!', timeout: 1000});
    }
  }

  const confirmResetPassword = () => {
    if(confirm) confirm(
      () => resetPassword(),          // onConfirm
      () => {},                       // onCancel
      'Are you sure?',                // header
      'This user\'s password will be updated on their next login.' // body
    );
  }

  return (
    <div>
      <div className="col-12 col-md-6 d-flex justify-content-start my-2">
        <Button onClick={onEdit} className="w-100">
          <FontAwesomeIcon icon={faUserPen} />
          <span className="ms-2">Update Username</span>
        </Button>
      </div>
      <div className="col-12 col-md-6 d-flex justify-content-start my-2">
        <Button onClick={confirmResetPassword} className="w-100">
          <FontAwesomeIcon icon={faUnlock} />
          <span className="ms-2">Reset Password</span>
        </Button>
      </div>
      {user.user_id !== auth?.user?.user_id && 
        <div className="col-12 col-md-6 d-flex justify-content-start my-2">
          <Button onClick={onDelete} className="w-100" variant="outline-danger">
            <FontAwesomeIcon icon={faTrash} />
            <span className="ms-2">Delete User</span>
          </Button>
        </div>
      }
    </div>
  )
}

export default UserBody;
