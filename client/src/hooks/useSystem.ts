import { useContext } from "react";
import { SystemContext } from "../context/SystemProvider";

export const useSystem = () => {
  return useContext(SystemContext);
}
