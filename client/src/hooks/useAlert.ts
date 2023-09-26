import { useContext } from "react";
import { AlertContext } from "../context/AlertProvider";

export const useAlert = () => {
  return useContext(AlertContext);
}
