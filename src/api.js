import axios from "axios";
import { DateTime } from "luxon";

export async function getStations() {
  const apiUrl =
    "https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/Station?%24select=StationID%2CStationName&%24top=150&%24format=JSON";

  // return fetchAPI(apiUrl);

  return [
    {
      StationID: "0990",
      StationName: {
        Zh_tw: "南港",
        En: "Nangang",
      },
    },
    {
      StationID: "1000",
      StationName: {
        Zh_tw: "台北",
        En: "Taipei",
      },
    },
    {
      StationID: "1010",
      StationName: {
        Zh_tw: "板橋",
        En: "Banqiao",
      },
    },
    {
      StationID: "1020",
      StationName: {
        Zh_tw: "桃園",
        En: "Taoyuan",
      },
    },
    {
      StationID: "1030",
      StationName: {
        Zh_tw: "新竹",
        En: "Hsinchu",
      },
    },
    {
      StationID: "1035",
      StationName: {
        Zh_tw: "苗栗",
        En: "Miaoli",
      },
    },
    {
      StationID: "1040",
      StationName: {
        Zh_tw: "台中",
        En: "Taichung",
      },
    },
    {
      StationID: "1043",
      StationName: {
        Zh_tw: "彰化",
        En: "Changhua",
      },
    },
    {
      StationID: "1047",
      StationName: {
        Zh_tw: "雲林",
        En: "Yunlin",
      },
    },
    {
      StationID: "1050",
      StationName: {
        Zh_tw: "嘉義",
        En: "Chiayi",
      },
    },
    {
      StationID: "1060",
      StationName: {
        Zh_tw: "台南",
        En: "Tainan",
      },
    },
    {
      StationID: "1070",
      StationName: {
        Zh_tw: "左營",
        En: "Zuoying",
      },
    },
  ];
}

export async function getTrainsOfStation(stationID) {
  const today = DateTime.now().toFormat("yyyy-MM-dd");

  const apiUrl = `https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/DailyTimetable/Station/${stationID}/${today}?%24select=TrainDate%2CDepartureTime%2CTrainNo%2CEndingStationName&%24top=150&%24format=JSON`;

  return fetchAPI(apiUrl);
}

export async function getTrainInfo(trainNo) {
  const apiUrl = `https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/DailyTimetable/Today/TrainNo/${trainNo}?%24select=StopTimes&%24top=30&%24format=JSON`;

  return fetchAPI(apiUrl);
}

export async function fetchAPI(url) {
  let res = [];

  try {
    const { data } = await axios(url);
    res = data;
  } catch (error) {
    console.log(error);
  }

  return res;
}
