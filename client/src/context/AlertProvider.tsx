import { createContext, useRef, useState } from "react";
import {InputAlert, StoredAlert, AlertContextType} from "../../@types/alert";
import Toast from "react-bootstrap/Toast";

export const AlertContext = createContext<AlertContextType>({alerts: []});

interface Props {
  children: React.ReactNode,
};
const AlertProvider: React.FC<Props> = ({ children }) => {
  const [alerts, setAlerts] = useState<StoredAlert[]>([]);

  const alertsRef = useRef(alerts);
  alertsRef.current = alerts;

  const addAlert = (alert: InputAlert) => {
    const {timeout = 1000} = alert;
    const uuid = crypto.randomUUID();
    const newAlert: StoredAlert = {uuid, ...alert};
    setAlerts([...alerts, newAlert]);
    setTimeout(() => {
      setAlerts(alertsRef.current.filter(a => a.uuid !== uuid));
    }, timeout);
  }

  const removeAlert = (uuid: string) => {
    setAlerts(alerts.filter(a => a.uuid !== uuid));
  }

  return (
    <AlertContext.Provider value={{alerts, addAlert}}>
      <div className="position-absolute d-flex align-items-center align-items-md-end flex-column w-100 bottom-0 end-0 p-3">
        {alerts.map(({uuid, type, message}) => (
          <Toast 
            key={uuid} 
            className="d-inline-block z-index-1 my-1" 
            bg={type}
            onClose={() => removeAlert(uuid)}
            style={{position: 'relative', top: 'auto', left: 'auto', transform: 'inherit'}}
          >
            <Toast.Header>
              <strong className="me-auto">Alert</strong>
            </Toast.Header>
            <Toast.Body>{message}</Toast.Body>
          </Toast>
        ))}
      </div>
      {children}
    </AlertContext.Provider>
  )
}

export default AlertProvider;
