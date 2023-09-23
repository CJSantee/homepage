import { useContext } from "react";
import { ConfirmContext } from "../context/ConfirmProvider";

const useConfirm = () => {
  const confirmContext = useContext(ConfirmContext);
  return confirmContext.confirm;
};

export { useConfirm };
