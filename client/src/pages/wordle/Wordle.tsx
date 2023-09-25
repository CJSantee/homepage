import Container from "react-bootstrap/Container";
import ProgressBar from "react-bootstrap/Progressbar";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import ResultsForm, { UserWordleStats } from "./components/ResultsForm";
import Leaderboard from "./components/Leaderboard";

function Wordle() {
  const [wordlesPlayed, setWordlesPlayed] = useState(0);
  const [winPercentage, setWinPercentage] = useState(0);
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

  useEffect(() => {
    const getStats = async () => {
      const {data, success} = await api.get('/wordle');
      if(success) {
        const {played, win_percentage, current_streak, max_streak, guess_distribution} = data;
        setWordlesPlayed(played);
        setWinPercentage(win_percentage);
        setCurrentStreak(current_streak);
        setMaxStreak(max_streak);
        setGuessDistribution(guess_distribution);
      }
    }
    getStats();
  }, []);

  const updateStats = (stats: UserWordleStats) => {
    const {played, win_percentage, current_streak, max_streak, guess_distribution} = stats;
    setWordlesPlayed(played);
    setWinPercentage(win_percentage);
    setCurrentStreak(current_streak);
    setMaxStreak(max_streak);
    setGuessDistribution(guess_distribution);
  }

  return (
    <Container>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-7 mb-3 p-0 pe-lg-2">
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
            <div className="d-flex flex-column align-items-center rounded border p-2">
              <span>{currentStreak}</span>
              <p className="m-0">Current Streak</p>
            </div>
            <div className="d-flex flex-column align-items-center rounded border p-2">
              <span>{maxStreak}</span>
              <p className="m-0">Max Streak</p>
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
