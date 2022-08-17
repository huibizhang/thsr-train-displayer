import { useEffect, useState } from "react";

function DigitalClock() {
  const [hourText, setHourText] = useState("00");
  const [minuteText, setMinuteText] = useState("00");

  useEffect(() => {
    init();
  }, []);

  function init() {
    setInterval(showTime, 1000);
  }

  function showTime() {
    let now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();

    setHourText(fixDigit(hour));
    setMinuteText(fixDigit(minute));
  }

  function fixDigit(num) {
    if (num < 10) return `0${num}`;
    else return `${num}`;
  }

  return (
    <div className="flex-none text-center font-mono font-black text-white">
      <div className="-mb-2 text-lg">現在時刻</div>
      <div className="text-4xl">
        {hourText}:{minuteText}
      </div>
    </div>
  );
}

export default DigitalClock;
