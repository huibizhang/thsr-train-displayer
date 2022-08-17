import React, { useEffect, useState } from "react";
import BoundCard from "./components/BoundCard";
import AnalogClock from "./components/AnalogClock";
import DigitalClock from "./components/DigitalClock";
import { getStations, getTrainsOfStation } from "./api";

function App() {
  const [stations, setStations] = useState([]);
  const [trains, setTrains] = useState([]);

  const [selectedStation, setSelectedStation] = useState(0);

  const [southboundPlatformData, setSouthboundPlatformData] = useState([]);
  const [northboundPlatformData, setNorthboundPlatformData] = useState([]);

  useEffect(() => {
    getStations().then((result) => {
      const temp = result.map((station) => {
        return {
          stationID: station.StationID,
          name: station.StationName.Zh_tw,
        };
      });
      setStations(temp);

      console.log(temp);
    });
  }, []);

  useEffect(() => {
    if (stations.length > 0) {
      setStationIndex(selectedStation);
    }
  }, [stations]);

  const setStationIndex = (index) => {
    setSelectedStation(index);

    const { stationID } = stations[index];

    getTrainsOfStation(stationID).then((result) => {
      setTrains(result);
    });
  };

  useEffect(() => {
    getNextTwoTrains();
  }, [trains]);

  const getNextTwoTrains = () => {
    if (trains.length === 0) return;

    // const now = new Date("2022-08-17 12:00").getTime();
    const now = new Date().getTime();

    const nextTwoSouthTrains = getTrainByTime(now, true, 2);
    const nextTwoNorthTrains = getTrainByTime(now, false, 2);

    console.log(nextTwoSouthTrains, nextTwoNorthTrains);

    setSouthboundPlatformData(nextTwoSouthTrains);
    setNorthboundPlatformData(nextTwoNorthTrains);
  };

  const getTrainByTime = (startTime, isSouthbound, max) => {
    const direction = isSouthbound ? 0 : 1;

    return trains
      .filter((train) => {
        const { TrainDate, DepartureTime, Direction } = train;
        const trainTime = new Date(`${TrainDate} ${DepartureTime}`).getTime();

        return trainTime >= startTime && Direction === direction;
      })
      .filter((train, index) => index < max)
      .map((train) => {
        return {
          currentStation: stations[selectedStation].name,
          stationsWillArrive: [],
          isSouthbound: isSouthbound,
          trainData: {
            number: Number(train.TrainNo),
            to: train.EndingStationName.Zh_tw,
            departureTime: train.DepartureTime,
            freeSeat: "9-12",
          },
        };
      });
  };

  // const platformData = [
  //   {
  //     currentStation: "板橋",
  //     stationsWillArrive: ["南港", "台北", "板橋", "台中", "左營"],
  //     isSouthbound: true,
  //     trainData: {
  //       number: 675,
  //       to: "左營",
  //       departureTime: "18:46",
  //       freeSeat: "8-12",
  //     },
  //   },
  //   {
  //     currentStation: "板橋",
  //     stationsWillArrive: [
  //       "南港",
  //       "台北",
  //       "板橋",
  //       "桃園",
  //       "新竹",
  //       "台中",
  //       "嘉義",
  //       "台南",
  //       "左營",
  //     ],
  //     isSouthbound: false,
  //     trainData: {
  //       number: 664,
  //       to: "南港",
  //       departureTime: "18:36",
  //       freeSeat: "9-12",
  //     },
  //   },
  // ];

  return (
    <div className="flex h-screen w-screen flex-col">
      {/* Station Selector */}
      <div className="flex-none p-5 text-center">
        <div className="text-sm text-gray-400">選擇車站</div>
        <select
          className="mt-2 rounded-md border py-2 px-5"
          onChange={(e) => {
            setStationIndex(e.target.value);
          }}
        >
          {stations.map((station, index) => {
            return (
              <option key={station.stationID} value={index}>
                {station.name}
              </option>
            );
          })}
        </select>
      </div>

      {/* Dashboard */}
      <div className="flex p-5">
        <div className="flex w-full bg-gray-900">
          <BoundCard platformData={southboundPlatformData}>
            <div className="px-3 pb-2 text-2xl font-black text-green-400">
              南下月台
            </div>
          </BoundCard>

          <div className="flex flex-none flex-col px-5 pt-10 pb-3">
            <AnalogClock></AnalogClock>
            <div className="flex-1"></div>
            <DigitalClock></DigitalClock>
          </div>

          <BoundCard platformData={northboundPlatformData}>
            <div className="px-3 pb-2 text-right text-2xl font-black text-sky-400">
              北上月台
            </div>
          </BoundCard>
        </div>
      </div>
    </div>
  );
}

export default App;
