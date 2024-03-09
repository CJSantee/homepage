export type ConfirmContextType = {
  confirm?: (
    on_confirm: () => void,
    on_cancel: () => void,
    header_text?: string,
    body_text?: string,
  ) => void,
};
