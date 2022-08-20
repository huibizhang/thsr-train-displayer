import React, { useEffect, useRef, useState } from "react";
import BoundCard from "./components/BoundCard";
import AnalogClock from "./components/AnalogClock";
import DigitalClock from "./components/DigitalClock";
import { getStations, getTrainsOfStation, getTrainInfo } from "./api";
import clsx from "clsx";
import store from "./store";

const App = () => {
  const [stations, setStations] = useState(store.stations);
  const newestStations = useRef(stations);

  const [trains, setTrains] = useState(store.trains);
  const newestTrains = useRef(trains);

  const [selectedStation, setSelectedStation] = useState(0);
  const lastestSelectedStation = useRef(selectedStation);

  const [southboundPlatformData, setSouthboundPlatformData] = useState([]);
  const [northboundPlatformData, setNorthboundPlatformData] = useState([]);
  const newestSouthboundPFD = useRef(southboundPlatformData);
  const newestNorthboundPFD = useRef(northboundPlatformData);

  const [selectorLocker, setSelectorLocker] = useState(false);

  let lastTime = 0;

  useEffect(() => {
    getStations().then((result) => {
      const temp = result.map((station) => {
        return {
          stationID: station.StationID,
          name: station.StationName.Zh_tw,
        };
      });
      store.stations = temp;
      setStations(store.stations);

      timeChecker();
    });
  }, []);

  useEffect(() => {
    // if (stations.length > 0) {
    //   setStationIndex(selectedStation);
    // }
    newestStations.current = stations;
    console.log("stations.length === ", stations.length);
  }, [stations]);

  useEffect(() => {
    lastestSelectedStation.current = selectedStation;
  }, [selectedStation]);

  const setStationIndex = (index) => {
    if (index === 0) return;

    setSelectedStation(index - 1);

    const { stationID } = stations[index - 1];

    getTrainsOfStation(stationID).then((result) => {
      if (result) {
        if (result.length > 0) {
          store.trains = result;
          setTrains(store.trains);
          // trains = result;
          // console.log(result);

          // getNextTwoTrains();
        }
      }
    });

    // setSelectorLocker(true);
    // setTimeout(() => setSelectorLocker(false), 10000);
  };

  useEffect(() => {
    newestTrains.current = trains;

    if (trains.length > 0) {
      getNextTwoTrains();
    }

    console.log("trains changed\ntrains.length === ", trains.length);
  }, [trains]);

  function timeChecker() {
    const d = new Date();
    d.setSeconds(0);
    d.setMilliseconds(0);
    const now = d.getTime();

    if (now - lastTime >= 30000) {
      console.log(now - lastTime);
      lastTime = now;

      console.log(store);

      // if (stations?.length === 0) {
      //   setStations(store.stations);
      // }
      // if (trains?.length === 0) {
      //   setTrains(store.trains);
      // }

      // console.log(
      //   "IN timer()",
      //   "\nstations.length === ",
      //   stations.length,
      //   "\ntrains.length === ",
      //   trains.length
      // );
      getNextTwoTrains();
    }

    setTimeout(timeChecker, 1000);
  }

  function getNextTwoTrains() {
    console.log("trains.length === ", newestTrains.current.length);
    if (newestTrains.current.length === 0) {
      // return;
    }

    // const now = new Date("2022-08-17 12:00").getTime();
    const d = new Date();
    d.setSeconds(0);
    d.setMilliseconds(0);
    const now = d.getTime();

    const nextTwoSouthTrains = getTrainByTime(now, true, 2);
    const nextTwoNorthTrains = getTrainByTime(now, false, 2);

    let tempKeyNew, tempKey;

    tempKeyNew = nextTwoSouthTrains
      .map((t) => t.trainOriginData.TrainNo + t.currentStation)
      .join("");
    tempKey = newestSouthboundPFD.current
      .map((t) => t.trainOriginData.TrainNo + t.currentStation)
      .join("");
    if (tempKeyNew !== tempKey) {
      getSouthboundTrainsTimes(nextTwoSouthTrains);
    }
    console.log("South", tempKey, tempKeyNew);

    tempKeyNew = nextTwoNorthTrains
      .map((t) => t.trainOriginData.TrainNo + t.currentStation)
      .join("");
    tempKey = newestNorthboundPFD.current
      .map((t) => t.trainOriginData.TrainNo + t.currentStation)
      .join("");
    if (tempKeyNew !== tempKey) {
      getNorthboundTrainsTimes(nextTwoNorthTrains);
    }
    console.log("North", tempKey, tempKeyNew);

    console.log(
      "IN getNextTwoTrains()\ntrains.length === ",
      newestTrains.current.length
    );
  }

  const getTrainByTime = (startTime, isSouthbound, max) => {
    const direction = isSouthbound ? 0 : 1;

    console.log(
      "IN getTrainByTime()",
      "\nstations.length === ",
      newestStations.current.length,
      "\ntrains.length === ",
      newestTrains.current.length
    );

    return newestTrains.current
      .filter((train) => {
        const { TrainDate, DepartureTime, Direction } = train;
        const trainTime = new Date(`${TrainDate} ${DepartureTime}`).getTime();

        return trainTime >= startTime && Direction === direction;
      })
      .filter((train, index) => index < max)
      .map((train) => {
        const { TrainDate, DepartureTime } = train;
        const trainTime = new Date(`${TrainDate} ${DepartureTime}`).getTime();
        console.log(train.TrainNo, startTime, trainTime);

        return {
          currentStation:
            newestStations.current[lastestSelectedStation.current].name,
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

  useEffect(() => {
    newestSouthboundPFD.current = southboundPlatformData;
    newestNorthboundPFD.current = northboundPlatformData;
  }, [southboundPlatformData, northboundPlatformData]);

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
          <option value={0}></option>
          {stations.map((station, index) => {
            return (
              <option key={station.stationID} value={index + 1}>
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
};

export default App;
