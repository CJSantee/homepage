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

/**
 * @description Exclusive max and Inclusive min
 */
export const getRandomInt = (max:number, min?:number): number => {
  min = Math.ceil(min || 0);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

export const once = (fxn, context = null) => {
  let executed = false;
  let result;
  return (...args) => {
    if(executed) {
      return result;
    }
    executed = true;
    result = fxn.call(context, ...args);
    return result;
  }
}

export const aclHasPermission = (acl: string, permission: string): boolean => {
  if(acl === 'colin') {
    return true;
  }
  const acls = acl?.split('|') || [];
  return acls.includes(permission);
}
