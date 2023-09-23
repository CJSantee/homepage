import { createContext, useState } from "react";
import { ConfirmContextType } from "../../@types/confirm";
import ConfirmationModal from "../components/ConfirmationModal";

export const ConfirmContext = createContext<ConfirmContextType>({});

interface Props {
  children: React.ReactNode,
};
const ConfirmProvider: React.FC<Props> = ({ children }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [onConfirm, setOnConfirm] = useState(() => {return () => {}});
  const [onCancel, setOnCancel] = useState(() => {return () => {}});
  const [headerText, setHeaderText] = useState('');
  const [bodyText, setBodyText] = useState('');

  const resetState = () => {
    setShowConfirm(false);
    setOnConfirm(() => {return () => {}});
    setOnCancel(() => {return () => {}});
    setHeaderText('');
    setBodyText('');
  }

  const clickCancel = () => {
    onCancel();
    resetState();
  }

  const clickConfirm = () => {
    onConfirm();
    resetState();
  } 

  const confirm: ConfirmContextType["confirm"] = (on_confirm, on_cancel, header_text = '', body_text = '') => {
    // Set all the variables
    setOnConfirm(() => on_confirm);
    setOnCancel(() => on_cancel);
    setHeaderText(header_text);
    setBodyText(body_text);
    // Show Modal
    setShowConfirm(true);
  }

  return (
    <ConfirmContext.Provider
      value={{
        confirm,
      }}
    >
      <ConfirmationModal 
        show={showConfirm}
        onConfirm={clickConfirm}
        onCancel={clickCancel}
        headerText={headerText} 
        bodyText={bodyText}
      />
      {children}
    </ConfirmContext.Provider>
  )
}

export default ConfirmProvider;