import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import api from "../../../utils/api";
import { useAlert } from "../../../hooks/useAlert";

interface GuessDistribution {
  1: number,
  2: number,
  3: number,
  4: number,
  5: number,
  6: number,
}
export interface UserWordleStats {
  played: number,
  win_percentage: number,
  current_streak: number, 
  max_streak: number,
  guess_distribution: GuessDistribution,
}

interface ResultsFormProps {
  updateStats: (stats: UserWordleStats) => void
}
function ResultsForm({updateStats}:ResultsFormProps) {
  const [wordleResults, setWordleResults] = useState('');

  const alertManager = useAlert();

  const submitWordle = async () => {
    if(!wordleResults) return;
    const {data, success, error} = await api.post('/wordle', {results: wordleResults});
    if(success) {
      updateStats(data);
    } else if(error) {
      if(alertManager.addAlert) alertManager.addAlert({type: 'danger', message: error.message, timeout: 3000});
    }
  }

  return (
    <Form className="mb-3">
      <Form.Group className="mb-3">
        <Form.Label>Enter your results for today's Wordle:</Form.Label>
        <Form.Control 
          className="no-scrollbar" 
          as="textarea" 
          rows={8} 
          value={wordleResults} 
          onChange={(e) => setWordleResults(e.target.value)} 
        />
      </Form.Group>
      <Form.Group className="d-flex w-100 justify-content-center">
        <Button onClick={submitWordle}>Submit</Button>
      </Form.Group>
    </Form>
  )
}

export default ResultsForm;
