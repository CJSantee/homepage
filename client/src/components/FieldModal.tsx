import { Button, Form, Modal } from "react-bootstrap";
import { ModalProps } from "../@types/modal";
import { useState } from "react";

interface FieldModalProps extends ModalProps {
  headerText: string,
  type?: string,
  fieldTitle?: string,
  submitText?: string,
}
function FieldModal({ headerText, type, fieldTitle, submitText, show, onHide }: FieldModalProps) {
  const [field, setField] = useState('');

  return (
    <Modal show={show} fullscreen={"md-down"} onHide={onHide}>
      <Modal.Header className="border-0 pb-0" closeButton closeVariant="white" >
        <h4 className="text-primary m-0">{headerText}</h4>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate>
          <Form.Group className="mb-3">
            {fieldTitle && 
              <Form.Label>{fieldTitle}</Form.Label>
            }
            <Form.Control 
              type={type || 'text'}
              value={field}
              onChange={(e) => setField(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="d-flex justify-content-end">
            <Button>{submitText || "Submit"}</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default FieldModal;
