import { Variant } from "react-bootstrap/esm/types";

export interface InputAlert {
  type: Variant
  message: string,
  timeout?: number,
}

export interface StoredAlert {
  uuid: string,
  type: Variant,
  message: string,
  timeout?: number,
};

export type AlertContextType = {
  alerts: StoredAlert[],
  addAlert?: (alert: InputAlert) => void,
};
