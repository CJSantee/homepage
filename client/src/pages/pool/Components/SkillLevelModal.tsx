import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
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

interface SkillLevels {
  '8-Ball': number,
  '9-Ball': number,
}
interface SkillLevelModalProps extends ModalProps {
  onUpdate: () => void,
  skill_levels: SkillLevels,
}
function SkillLevelModal({ skill_levels, show, onUpdate, onHide }: SkillLevelModalProps) {
  const [discipline, setDiscipline] = useState<'9-Ball'|'8-Ball'>('9-Ball');
  const [eightBallSkill, setEightBallSkill] = useState(skill_levels['8-Ball']);
  const [nineBallSkill, setNineBallSkill] = useState(skill_levels['9-Ball']);
  const alertManager = useAlert();

  const setSkillLevels = (skill_levels: SkillLevels) => {
    setEightBallSkill(skill_levels['8-Ball']);
    setNineBallSkill(skill_levels['9-Ball']);
  }

  useEffect(() => {
    setSkillLevels(skill_levels);
  }, [skill_levels]);
  
  const setSkillLevel = (level: number) => {
    if(discipline === '8-Ball') {
      setEightBallSkill(level);
    } else if(discipline === '9-Ball') {
      setNineBallSkill(level);
    }
  }

  async function updateSkillLevel() {
    const {success} = await api.patch('/users', {
      discipline,
      skill_level: discipline === '8-Ball' ? eightBallSkill : nineBallSkill,
    });
    if(success && typeof alertManager.addAlert === 'function') {
      onUpdate();
      onHide();
      alertManager.addAlert({type: 'success', message: 'Skill Level Updated', timeout: 1000});
    }
  }
  
  return (
    <Modal show={show} fullscreen={"md-down"} onHide={() => {
      setSkillLevels(skill_levels);
      onHide();
    }}>
      <Modal.Header className="border-0 pb-0" closeButton closeVariant="white">
        <h4 className="text-primary m-0">Skill Level</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column">
          <ButtonGroup className="mb-3">
            <Button 
              onClick={() => setDiscipline('8-Ball')}
              variant={discipline !== '8-Ball' ? 'outline-primary' : 'primary'}>8-Ball</Button>
            <Button 
              onClick={() => setDiscipline('9-Ball')}
              variant={discipline !== '9-Ball' ? 'outline-primary' : 'primary'}>9-Ball</Button>
          </ButtonGroup>
          {discipline === '9-Ball' && (
            <div className="row">
              <SkillButton 
                level={1} 
                className="pb-2 col-12" 
                skillLevel={nineBallSkill} 
                onClick={setSkillLevel} />
            </div>
          )}
          <div className="row">
          <SkillButton 
            level={2} 
            className="pe-1 pb-1" 
            skillLevel={discipline === '8-Ball' ? eightBallSkill : nineBallSkill} 
            onClick={setSkillLevel} />
            <SkillButton 
              level={3} 
              className="ps-1 pb-1" 
              skillLevel={discipline === '8-Ball' ? eightBallSkill : nineBallSkill} 
              onClick={setSkillLevel} />
          </div>
          <div className="row">
            <SkillButton 
              level={4} 
              className="pe-1 py-1" 
              skillLevel={discipline === '8-Ball' ? eightBallSkill : nineBallSkill} 
              onClick={setSkillLevel} />
            <SkillButton 
              level={5} 
              className="ps-1 py-1" 
              skillLevel={discipline === '8-Ball' ? eightBallSkill : nineBallSkill} 
              onClick={setSkillLevel} />
          </div>
          <div className="row">
            <SkillButton 
              level={6} 
              className="pe-1 pt-1" 
              skillLevel={discipline === '8-Ball' ? eightBallSkill : nineBallSkill} 
              onClick={setSkillLevel} />
            <SkillButton 
              level={7} 
              className="ps-1 pt-1" 
              skillLevel={discipline === '8-Ball' ? eightBallSkill : nineBallSkill} 
              onClick={setSkillLevel} />
          </div>
          {discipline === '9-Ball' && (
            <div className="row">
              <SkillButton 
                level={8} 
                className="pe-1 pt-2" 
                skillLevel={nineBallSkill} 
                onClick={setSkillLevel} />
              <SkillButton 
                level={9} 
                className="ps-1 pt-2" 
                skillLevel={nineBallSkill} 
                onClick={setSkillLevel} />
            </div>
          )}
          <div className="row mt-3">
            <Button onClick={updateSkillLevel}>Update</Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default SkillLevelModal;
