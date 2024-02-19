import Container from "react-bootstrap/Container";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import ResultsForm, { UserWordleStats } from "./components/ResultsForm";
import Leaderboard from "./components/Leaderboard";

function Wordle() {
  const [wordlesPlayed, setWordlesPlayed] = useState(0);
  const [winPercentage, setWinPercentage] = useState('0.00');
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [guessDistribution, setGuessDistribution] = useState({
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0, 
  });

  const updateStats = (stats: UserWordleStats) => {
    const {played, win_percentage, current_streak, max_streak, guess_distribution} = stats;
    if(played) {
      setWordlesPlayed(played);
    }
    if(win_percentage) {
      setWinPercentage(Number(win_percentage * 100).toFixed(2));
    }
    if(current_streak) {
      setCurrentStreak(current_streak);
    }
    if(max_streak) {
      setMaxStreak(max_streak);
    }
    if(guess_distribution) {
      setGuessDistribution(guess_distribution);
    }
  }

  useEffect(() => {
    const getStats = async () => {
      const {data, success} = await api.get('/wordle');
      if(success) {
        updateStats(data);
      }
    }
    getStats();
  }, []);

  return (
    <Container>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-7 mb-3 p-0 pe-lg-2">
          <h3>Player Stats</h3>
          <div className="row d-flex py-2 mb-2">
            <div className="col-6 col-md-3 p-2">
              <div className="d-flex flex-column justify-content-center align-items-center rounded border p-2 h-100">
                <span className="fw-bold">{wordlesPlayed}</span>
                <p className="m-0 text-center">Played</p>
              </div>
            </div>
            <div className="col-6 col-md-3 p-2">
              <div className="d-flex flex-column justify-content-center align-items-center rounded border p-2 h-100">
                <span className="fw-bold">{winPercentage}</span>
                <p className="m-0 text-center">Win %</p>
              </div>
            </div>
            <div className="col-6 col-md-3 p-2">
              <div className="d-flex flex-column justify-content-center align-items-center rounded border p-2 h-100">
                <span className="fw-bold">{currentStreak}</span>
                <p className="m-0 text-center">Current Streak</p>
              </div>
            </div>
            <div className="col-6 col-md-3 p-2">
              <div className="d-flex flex-column justify-content-center align-items-center rounded border p-2 h-100">
                <span className="fw-bold">{maxStreak}</span>
                <p className="m-0 text-center">Max Streak</p>
              </div>
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
        <div className="d-flex col-12 col-lg-5 justify-content-center justify-content-lg-end p-0 ps-lg-2">
          <div className="row">
            <div className="col-12 mb-3">
              <h3>Leaderboard</h3>
              <Leaderboard />
            </div>
            <div className="col-12">
              <ResultsForm updateStats={updateStats}/>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Wordle;
