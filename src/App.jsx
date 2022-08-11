import React, { useState } from "react";
import PlatformCard from "./components/PlatformCard";

function App() {
  const platformData = [
    {
      currentStation: "板橋",
      stationsWillArrive: ["南港", "台北", "板橋", "台中", "左營"],
      isSouthbound: true,
      trainData: {
        number: 675,
        to: "左營",
        departureTime: "18:46",
        freeSeat: "8-12",
      },
    },
    {
      currentStation: "板橋",
      stationsWillArrive: [
        "南港",
        "台北",
        "板橋",
        "桃園",
        "新竹",
        "台中",
        "嘉義",
        "台南",
        "左營",
      ],
      isSouthbound: false,
      trainData: {
        number: 664,
        to: "南港",
        departureTime: "18:36",
        freeSeat: "9-12",
      },
    },
  ];

  return (
    <div className="w-full bg-gray-900 p-2">
      <PlatformCard {...platformData[0]}></PlatformCard>

      <div className="mb-1 mt-2.5 text-xl font-bold text-white">
        <marquee>
          列車即將進站，請不要靠近月台邊。並請您在上車時月台與車廂的高低落差及間距，以免發生危險，祝您旅途愉快。
        </marquee>
      </div>

      <PlatformCard {...platformData[1]}></PlatformCard>
    </div>
  );
}

export default App;
