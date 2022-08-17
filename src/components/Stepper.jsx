import clsx from "clsx";
import { useEffect, useState } from "react";
import Step from "./Step";

const Stepper = (props) => {
  const {
    currentStation = "台北",
    isSouthbound = true,
    willArrived = [],
  } = props;

  const [_willArrived, setWillArrived] = useState(willArrived);
  const [_currentStation, setCurrentStation] = useState(currentStation);

  useEffect(() => {
    setWillArrived(willArrived);
  }, [willArrived]);

  useEffect(() => {
    setCurrentStation(currentStation);
  }, [currentStation]);

  const getStations = () => {
    const stations = [
      "南港",
      "台北",
      "板橋",
      "桃園",
      "新竹",
      "苗栗",
      "台中",
      "彰化",
      "雲林",
      "嘉義",
      "台南",
      "左營",
    ];

    if (isSouthbound) return stations;
    else return [...stations].reverse();
  };

  return (
    <div
      className={clsx([
        "flex bg-gray-900 transition-all",
        _willArrived.length === 0 && "opacity-0",
      ])}
    >
      {getStations().map((station, index) => {
        const currentStationIndex = getStations().indexOf(_currentStation);

        let status = -1;

        if (index === currentStationIndex) status = 0;
        else if (index > currentStationIndex) status = 1;

        return (
          <Step
            key={station}
            name={station}
            state={status}
            willArrived={_willArrived.indexOf(station) > -1}
            isSouthbound={isSouthbound}
          ></Step>
        );
      })}
    </div>
  );
};

export default Stepper;
