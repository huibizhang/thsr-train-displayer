import React, { useState } from "react";
import Stepper from "./Stepper";

const PlatformCard = () => {
  const currentStation = "板橋";

  const stationsWillArrive = ["南港", "台北", "板橋", "台中", "左營"];

  return (
    <Stepper
      currentStation={currentStation}
      willArrived={stationsWillArrive}
      isSouthbound={true}
    ></Stepper>
  );
};

export default PlatformCard;
