import React, { useEffect, useState } from "react";
import BoundCard from "./components/BoundCard";
import AnalogClock from "./components/AnalogClock";
import DigitalClock from "./components/DigitalClock";
import { getStations, getTrainsOfStation, getTrainInfo } from "./api";
import clsx from "clsx";

function App() {
  const [stations, setStations] = useState([]);
  const [trains, setTrains] = useState([]);

  const [selectedStation, setSelectedStation] = useState(0);

  const [southboundPlatformData, setSouthboundPlatformData] = useState([]);
  const [northboundPlatformData, setNorthboundPlatformData] = useState([]);

  const [selectorLocker, setSelectorLocker] = useState(false);

  const lastTime = 0;

  const _southboundPlatformData = [];
  const _northboundPlatformData = [];

  useEffect(() => {
    getStations().then((result) => {
      const temp = result.map((station) => {
        return {
          stationID: station.StationID,
          name: station.StationName.Zh_tw,
        };
      });
      setStations(temp);

      setInterval(getNextTwoTrains, 1000);
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

    // setSelectorLocker(true);
    // setTimeout(() => setSelectorLocker(false), 10000);
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

    console.log(nextTwoNorthTrains);

    let tempKeyNew, tempKey;

    tempKeyNew = nextTwoSouthTrains
      .map((t) => t.trainOriginData.TrainNo + t.currentStation)
      .join("");
    tempKey = southboundPlatformData
      .map((t) => t.trainOriginData.TrainNo + t.currentStation)
      .join("");
    if (tempKeyNew !== tempKey) {
      getSouthboundTrainsTimes(nextTwoSouthTrains);
    }
    console.log("South", tempKey, tempKeyNew);

    tempKeyNew = nextTwoNorthTrains
      .map((t) => t.trainOriginData.TrainNo + t.currentStation)
      .join("");
    tempKey = northboundPlatformData
      .map((t) => t.trainOriginData.TrainNo + t.currentStation)
      .join("");
    if (tempKeyNew !== tempKey) {
      getNorthboundTrainsTimes(nextTwoNorthTrains);
    }
    console.log("North", tempKey, tempKeyNew);
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
          trainOriginData: train,
        };
      });
  };

  const getSouthboundTrainsTimes = (trainsData) => {
    trainsData.forEach((train, index) => {
      const { TrainNo } = train.trainOriginData;

      getTrainInfo(TrainNo).then((result) => {
        const temp = [...trainsData];

        try {
          temp[index].stationsWillArrive = result[0]?.StopTimes.map((stop) => {
            return stop.StationName.Zh_tw;
          });

          setSouthboundPlatformData(temp);
        } catch (error) {}
      });
    });
  };

  const getNorthboundTrainsTimes = (trainsData) => {
    trainsData.forEach((train, index) => {
      const { TrainNo } = train.trainOriginData;

      getTrainInfo(TrainNo).then((result) => {
        const temp = [...trainsData];

        temp[index].stationsWillArrive = result[0].StopTimes.map((stop) => {
          return stop.StationName.Zh_tw;
        });

        setNorthboundPlatformData(temp);
      });
    });
  };

  return (
    <div className="flex h-screen w-screen flex-col">
      <div
        className={clsx(["inset-0 mx-auto h-1 bg-blue-500 transition-all"])}
      ></div>

      {/* Station Selector */}
      <div className="flex-none p-5 text-center">
        <div className="text-sm text-gray-400">選擇車站</div>
        <select
          className={clsx([
            "mt-2 rounded-md border py-2 px-5 transition-all",
            selectorLocker && "bg-gray-200 text-gray-600",
          ])}
          onChange={(e) => {
            setStationIndex(e.target.value);
          }}
          disabled={selectorLocker}
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
          <BoundCard platformData={[...southboundPlatformData]}>
            <div className="px-3 pb-2 text-2xl font-black text-green-400">
              南下月台
            </div>
          </BoundCard>

          <div className="flex flex-none flex-col px-5 pt-10 pb-3">
            <AnalogClock></AnalogClock>
            <div className="flex-1"></div>
            <DigitalClock></DigitalClock>
          </div>

          <BoundCard platformData={[...northboundPlatformData]}>
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
