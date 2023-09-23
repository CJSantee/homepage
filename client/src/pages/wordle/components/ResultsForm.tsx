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
    const {data, success} = await api.post('/wordle', {results: wordleResults});
    if(success) {
      updateStats(data);
    } else {
      if(alertManager.addAlert) alertManager.addAlert({type: 'danger', message: data, timeout: 3000});
    }
  }


  return (
    <Form>
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
