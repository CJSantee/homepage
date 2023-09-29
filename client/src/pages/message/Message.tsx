import Container from "react-bootstrap/Container";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from "react-bootstrap/Button";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import MessageType from "../../../@types/message";
import api from "../../utils/api";
import { toReadablePhone } from "../../utils";


function Message() {
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<MessageType[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  async function getUserMessages() {
    const {success, data} = await api.get('/message');
    if(success) {
      setMessages(data);
    }
  }

  async function postUserMessage() {
    if(!messageInput) return;
    const {success, data} = await api.post('/message', {message: messageInput});
    if(success) {
      setMessages(data);
      setMessageInput('');
    }
  }

  useEffect(() => {
    getUserMessages();
  }, []);

  function scrollToBottom(): void {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Container className="d-flex flex-column h-100">
      <div className="flex-fill">
        {messages.length ? 
          <div className="d-flex justify-content-center">
            <span>{toReadablePhone(messages.filter(m => m.direction === 'OUTGOING')?.[0]?.from_handle)}</span>
          </div> : null}
        {messages.map(userMessage => (
          <div 
            key={userMessage.message_id}
            className={`row ${userMessage.direction === 'OUTGOING' ? 'justify-content-start' : 'justify-content-end'}`}
          >
            <div className={`col-7 col-md-5 bg-${userMessage.direction === 'OUTGOING' ? 'dark' : 'secondary'} rounded my-1 py-2 px-3 text-break`}>
              <p className="m-0">{userMessage.message}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <Container className="sticky-bottom bg-body py-3 px-0">
        <InputGroup className="rounded">
          <Form.Control 
            as="textarea" 
            value={messageInput}
            rows={messageInput.split('\n').length}
            onChange={(e) => setMessageInput(e.target.value)}
            className="no-scrollbar no-shadow" 
          />
          <div className="d-flex flex-column justify-content-end">
            <Button onClick={postUserMessage} className="m-2 rounded">
              <FontAwesomeIcon icon={faPaperPlane} /> 
            </Button>
          </div>
        </InputGroup>
      </Container>
    </Container>
  )
}

export default Message;
