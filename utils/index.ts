export const secondsToReadable = (seconds: number) => {
  let time_remaining_str: string;
  let hrs: number = seconds / 3600;
  let hrStr: string = '';
  let minStr: string = '';
  let secStr: string = '';
  if(hrs > 24) {
    const days: number = Math.round(hrs / 24);
    // change sent to state.max_prep-time, change time_remaining to abs_time_remaining?
    time_remaining_str = `${days} ${days > 1 ? 'Days' : 'Day'}`;
  } else {
    seconds %= 3600;
    let mins: number = seconds / 60;
    seconds %= 60;
    let secs = seconds;
    if(secs < 10) {
      secStr = `0${secs}`;
    }
    if(mins < 10) {
      minStr = `0${mins}`;
    }
    if(hrs < 10) {
      hrStr = `0${hrs}`;
    }
    time_remaining_str = hrStr === '00' ? `${minStr}:${secStr}` : `${hrStr}:${minStr}:${secStr}`;
  }
  return time_remaining_str;
};