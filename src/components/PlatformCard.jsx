import React, { useEffect, useState } from "react";
import Stepper from "./Stepper";
import CardInfo from "./CardInfo";
import clsx from "clsx";

const PlatformCard = (props) => {
  const {
    currentStation = "南港",
    stationsWillArrive = [],
    isSouthbound = true,
    trainData = {
      number: "",
      to: "",
      departureTime: "",
      freeSeat: "",
    },
  } = props;

  const [_currentStation, setCurrentStation] = useState(currentStation);
  const [willArrive, setWillArrive] = useState(stationsWillArrive);
  const [_trainData, setTrainData] = useState(trainData);

  useEffect(() => {
    setCurrentStation(currentStation);
    setWillArrive(stationsWillArrive);
    setTrainData(trainData);
  }, [currentStation, stationsWillArrive, trainData]);

  return (
    <div className="relative min-w-0 rounded-xl border bg-gray-900 py-2 px-3">
      <div className="grid grid-cols-2 space-y-1">
        <CardInfo title="本班列車">{_trainData.number}</CardInfo>
        <CardInfo title="列車開往">
          <span
            className={clsx([isSouthbound ? "text-green-400" : "text-sky-400"])}
          >
            {_trainData.to}
          </span>
        </CardInfo>
        <CardInfo title="開車時間">{_trainData.departureTime}</CardInfo>
        <CardInfo title="自 由 座">
          {_trainData.freeSeat}
          {_trainData.freeSeat !== "" ? "車" : ""}
        </CardInfo>
      </div>

      <Stepper
        currentStation={_currentStation}
        willArrived={[...willArrive]}
        isSouthbound={isSouthbound}
      ></Stepper>

      <div className="absolute -top-0.5 -left-0.5 h-3.5 w-3.5 rounded-full border bg-gray-900"></div>
    </div>
  );
};

export default PlatformCard;
