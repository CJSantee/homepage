import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function Wordle() {
  const submitWordle = () => {

  }

  return (
    <Container>
      <div className="d-flex justify-content-center">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Enter your results for today's Wordle:</Form.Label>
            <Form.Control className="no-scrollbar" as="textarea" rows={8} />
          </Form.Group>
          <Form.Group className="d-flex w-100 justify-content-center">
            <Button onClick={submitWordle}>Submit</Button>
          </Form.Group>
        </Form>
      </div>
    </Container>
  );
}

export default Wordle;
