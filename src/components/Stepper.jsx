import Step from "./Step";

const Stepper = (props) => {
  const {
    currentStation = "台北",
    isSouthbound = true,
    willArrived = [],
  } = props;

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
    <div className="flex bg-gray-900">
      {getStations().map((station, index) => {
        const currentStationIndex = getStations().indexOf(currentStation);

        let status = -1;

        if (index === currentStationIndex) status = 0;
        else if (index > currentStationIndex) status = 1;

        return (
          <Step
            key={station}
            name={station}
            state={status}
            willArrived={willArrived.indexOf(station) > -1}
            isSouthbound={isSouthbound}
          ></Step>
        );
      })}
    </div>
  );
};

export default Stepper;
