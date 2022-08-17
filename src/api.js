import axios from "axios";
import moment from "moment";

export async function getStations() {
  const apiUrl =
    "https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/Station?%24select=StationID%2CStationName&%24top=150&%24format=JSON";

  return fetchAPI(apiUrl);
}

export async function getTrainsOfStation(stationID) {
  const dt = new Date();
  const today = moment(dt).format("YYYY-MM-DD");

  const apiUrl = `https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/DailyTimetable/Station/${stationID}/${today}?%24select=TrainDate%2CDepartureTime%2CTrainNo%2CEndingStationName&%24top=150&%24format=JSON`;

  return fetchAPI(apiUrl);
}

export async function getTrainInfo(trainNo) {
  const apiUrl = `https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/DailyTimetable/Today/TrainNo/${trainNo}?%24top=30&%24format=JSON`;

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
