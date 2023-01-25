// React Imports
import React from "react";
import { useState } from "react";
import * as Yup from "yup";

// Bootstrap Components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";

// Formik
import { Formik } from "formik";

// Validation Schema
const schema = Yup.object().shape({
  full_name: Yup.string()
    .min(2, "*Names must have at least 2 characters")
    .max(100, "*Names can't be longer than 100 characters")
    .required(),
  email: Yup.string()
    .email("*Must be a valid email address")
    .max(100, "*Email must be less than 100 characters")
    .required(),
  message: Yup.string().required(),
});

function Contact() {
  const [status, setStatus] = useState("Send");

  const [showToast, setShowToast] = useState(false);
  const [toastTitle, setToastTitle] = useState("");
  const [toastContent, setToastContent] = useState("");

  const toggleToast = () => setShowToast(!showToast);

  const toast = (title, content) => {
    setToastTitle(title);
    setToastContent(content);
    setShowToast(true);
  };

  const sendEmail = async (values) => {
    if (status === "Sent") {
      return;
    }
    setStatus("Sending...");
    let response = await fetch("/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(values),
    });
    let result = await response.json();
    setStatus("Sent");
    toast(
      result.status,
      "Your message has been sent and I will respond as soon as I can. \n Best, \n -Colin"
    );
  };

  return (
    <Container id='Contact'>
      <Row className='vh-100 align-items-center'>
        <Col md>
          <h2 className='text-primary'>Contact</h2>
          <p>Interested in working together? Contact me!</p>
        </Col>
        <Col md>
          <Formik
            validationSchema={schema}
            onSubmit={(values, actions) => {
              setTimeout(() => {
                sendEmail(values);
                actions.setSubmitting(false);
              }, 1000);
            }}
            initialValues={{
              full_name: "",
              email: "",
              message: "",
            }}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className='mb-3'>
                  <Form.Label>Full name</Form.Label>
                  <Form.Control
                    type='text'
                    name='full_name'
                    placeholder='Enter name'
                    value={values.full_name}
                    onChange={handleChange}
                    isValid={touched.full_name && !errors.full_name}
                    isInvalid={!!errors.full_name}
                  />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  <Form.Control.Feedback type='invalid'>
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type='email'
                    name='email'
                    placeholder='Enter email'
                    value={values.email}
                    onChange={handleChange}
                    isValid={touched.email && !errors.email}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  <Form.Control.Feedback type='invalid'>
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    name='message'
                    placeholder={"Hi Colin!\n...\n..."}
                    value={values.message}
                    onChange={handleChange}
                    isValid={touched.message && !errors.message}
                    isInvalid={!!errors.message}
                  />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  <Form.Control.Feedback type='invalid'>
                    {errors.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button
                  variant='primary'
                  type='submit'
                  disabled={status === "Sent"}
                >
                  {status}
                </Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
      <Toast show={showToast} onClose={toggleToast} className='toast'>
        <Toast.Header>
          <strong className='me-auto'>{toastTitle}</strong>
          <small>now</small>
        </Toast.Header>
        <Toast.Body>
          <p>{toastContent}</p>
        </Toast.Body>
      </Toast>
    </Container>
  );
}

export default Contact;
