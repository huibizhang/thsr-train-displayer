import clsx from "clsx";
import React, { useEffect, useState } from "react";
import stationStatus from "../stationState";

const Step = (props) => {
  const {
    name = "南港",
    state = stationStatus.passed,
    isSouthbound = true,
    willArrived = true,
  } = props;

  const [stationName, setStationName] = useState(name);
  const [stationState, setStationState] = useState(state);
  const [_willArrived, setWillArrived] = useState(willArrived);

  useEffect(() => {
    setStationName(name);
    setStationState(state);
    setWillArrived(willArrived);
  }, [name, state, willArrived]);

  const getStatusColor = (passedColor, currentColor, destColor) => {
    let result = "bg-gray-400";

    switch (stationState) {
      case stationStatus.passed: {
        result = passedColor;
        break;
      }
      case stationStatus.current: {
        result = currentColor;
        break;
      }
      case stationStatus.destination: {
        result = destColor;
        break;
      }
    }

    return result;
  };

  return (
    <div className="group w-20 py-2 text-center">
      <div
        className={clsx([
          "w-full pb-1 font-bold transition-all",
          getStatusColor(
            "text-gray-400",
            isSouthbound ? "text-green-400" : "text-sky-400",
            "text-white"
          ),
          !_willArrived && "opacity-0",
        ])}
      >
        {stationName}
      </div>
      <div className="relative flex h-3 w-full items-center justify-center">
        <div className="flex w-full">
          <div
            className={clsx([
              "h-1 flex-1 transition-all group-first:opacity-0",
              getStatusColor(
                "bg-gray-400",
                "bg-gray-400",
                isSouthbound ? "bg-green-400" : "bg-sky-400"
              ),
            ])}
          ></div>
          <div
            className={clsx([
              "h-1 flex-1 bg-gray-400 transition-all group-last:opacity-0",
              getStatusColor(
                "bg-gray-400",
                isSouthbound ? "bg-green-400" : "bg-sky-400",
                isSouthbound ? "bg-green-400" : "bg-sky-400"
              ),
            ])}
          ></div>
        </div>
        <div
          className={clsx([
            "absolute h-3 w-3 rounded-full transition-all",
            getStatusColor(
              "bg-gray-400",
              "bg-white",
              isSouthbound ? "bg-green-400" : "bg-sky-400"
            ),
            !_willArrived && "opacity-0",
          ])}
        ></div>
      </div>
    </div>
  );
};

export default Step;
