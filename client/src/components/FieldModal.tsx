import { Button, Form, Modal } from "react-bootstrap";
import { ModalProps } from "../@types/modal";

interface FieldModalProps extends ModalProps {
  submitText?: string,
}
function FieldModal({ submitText, show, onHide }: FieldModalProps) {
  return (
    <Modal show={show} fullscreen={"md-down"} onHide={onHide}>
      <Modal.Header>

      </Modal.Header>
      <Modal.Body>
        <Form noValidate>
          <Form.Group>

          </Form.Group>
          <Form.Group>
            <Button>{submitText || "Submit"}</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}