import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { ModalProps } from "../../../@types/modal";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { useAlert } from "../../../hooks/useAlert";

interface SkillButtonProps {
  className?: string,
  level: number,
  skillLevel: number,
  onClick: (level: number) => void,
}
const SkillButton = ({ className, level, skillLevel, onClick }: SkillButtonProps) => {
  return (
    <div onClick={() => onClick(level)} className={`col-6 cursor-pointer ${className}`}>
      <div className={`d-flex justify-content-center align-items-center border rounded p-4 ${level == skillLevel ? 'border-primary' : ''}`}>
        <span className="h2 fw-bold m-0">{level}</span>
      </div>
    </div>
  )
}

interface SkillLevelModalProps extends ModalProps {
  onUpdate: () => void,
  skill_level: number,
}
function SkillLevelModal({ skill_level, show, onUpdate, onHide }: SkillLevelModalProps) {
  const [skillLevel, setSkillLevel] = useState(skill_level);
  const alertManager = useAlert();

  useEffect(() => {
    setSkillLevel(skill_level);
  }, [skill_level]);

  async function updateSkillLevel() {
    const {success} = await api.post('/pool', {skill_level: skillLevel});
    if(success && typeof alertManager.addAlert === 'function') {
      onUpdate();
      onHide();
      alertManager.addAlert({type: 'success', message: 'Skill Level Updated', timeout: 1000});
    }
  }
  
  return (
    <Modal show={show} fullscreen={"md-down"} onHide={() => {
      setSkillLevel(skill_level);
      onHide();
    }}>
      <Modal.Header className="border-0 pb-0" closeButton closeVariant="white">
        <h4 className="text-primary m-0">Skill Level</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column">
          <div className="row">
            <SkillButton level={2} className="pe-1 pb-1" skillLevel={skillLevel} onClick={setSkillLevel} />
            <SkillButton level={3} className="ps-1 pb-1" skillLevel={skillLevel} onClick={setSkillLevel} />
          </div>
          <div className="row">
            <SkillButton level={4} className="pe-1 py-1" skillLevel={skillLevel} onClick={setSkillLevel} />
            <SkillButton level={5} className="ps-1 py-1" skillLevel={skillLevel} onClick={setSkillLevel} />
          </div>
          <div className="row">
            <SkillButton level={6} className="pe-1 pt-1" skillLevel={skillLevel} onClick={setSkillLevel} />
            <SkillButton level={7} className="ps-1 pt-1" skillLevel={skillLevel} onClick={setSkillLevel} />
          </div>
          <div className="row mt-3">
            <Button onClick={updateSkillLevel}>Update</Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default SkillLevelModal;
