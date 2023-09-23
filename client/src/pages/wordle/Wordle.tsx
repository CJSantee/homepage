import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/Progressbar";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useAlert } from "../../hooks/useAlert";

function Wordle() {
  const [wordlesPlayed, setWordlesPlayed] = useState(0);
  const [winPercentage, setWinPercentage] = useState(0);
  const [guessDistribution, setGuessDistribution] = useState({
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0, 
  });

  const [wordleResults, setWordleResults] = useState('');

  useEffect(() => {
    const getStats = async () => {
      const {data, success} = await api.get('/wordle');
      if(success) {
        const {played, win_percentage, guess_distribution} = data;
        setWordlesPlayed(played);
        setWinPercentage(win_percentage);
        setGuessDistribution(guess_distribution);
      }
    }
    getStats();
  }, []);

  const alertManager = useAlert();
  
  const submitWordle = async () => {
    if(!wordleResults) return;
    const {data, success} = await api.post('/wordle', {results: wordleResults});
    if(success) {
      const {played, win_percentage, guess_distribution} = data;
      setWordlesPlayed(played);
      setWinPercentage(win_percentage);
      setGuessDistribution(guess_distribution);
    } else {
      if(alertManager.addAlert) alertManager.addAlert({type: 'danger', message: data, timeout: 3000});
    }
  }

  return (
    <Container>
      <div className="row justify-content-center">
        <div className="col-7 mb-3">
          <h3>Player Stats</h3>
          <div className="d-flex justify-content-between py-2 mb-2">
            <div className="d-flex flex-column align-items-center rounded border p-2">
              <span>{wordlesPlayed}</span>
              <p className="m-0">Played</p>
            </div>
            <div className="d-flex flex-column align-items-center rounded border p-2">
              <span>{winPercentage * 100}</span>
              <p className="m-0">Win %</p>
            </div>
          </div>
          <h3>Guess Distribution</h3>
          <div>
            {Object.entries(guessDistribution).map(([key, value]) => (
              <div key={key} className="row align-items-center py-2">
                <div className="col-1">
                  <span>{key}</span>
                </div>
                <div className="col-11">
                  <ProgressBar className="flex-1" now={(value/wordlesPlayed)*100} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="d-flex col-12 col-lg-5 justify-content-center justify-content-lg-end">
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
        </div>
      </div>
    </Container>
  );
}

export default Wordle;
