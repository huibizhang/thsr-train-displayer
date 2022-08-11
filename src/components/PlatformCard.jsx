import React, { useState } from "react";
import Stepper from "./Stepper";
import CardInfo from "./CardInfo";

const PlatformCard = (props) => {
  const {
    currentStation = "台北",
    stationsWillArrive = [
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
    ],
    isSouthbound = true,
    trainData = {
      number: 153,
      to: "左營",
      departureTime: "18:31",
      freeSeat: "10-12",
    },
  } = props;

  return (
    <div className="relative w-full rounded-xl border bg-gray-900 py-2 px-3">
      <div className="grid grid-cols-2 space-y-1">
        <CardInfo title="本班列車">{trainData.number}</CardInfo>
        <CardInfo title="列車開往">{trainData.to}</CardInfo>
        <CardInfo title="開車時間">{trainData.departureTime}</CardInfo>
        <CardInfo title="自 由 座">{trainData.freeSeat}車</CardInfo>
      </div>

      <Stepper
        currentStation={currentStation}
        willArrived={stationsWillArrive}
        isSouthbound={isSouthbound}
      ></Stepper>

      <div className="absolute -top-0.5 -left-0.5 h-3.5 w-3.5 rounded-full border bg-gray-900"></div>
    </div>
  );
};

export default PlatformCard;
