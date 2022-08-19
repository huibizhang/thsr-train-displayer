import React, { useEffect, useState } from "react";
import PlatformCard from "./PlatformCard";

function BoundCard(props) {
  const { platformData = [] } = props;
  const child = props.children;

  const [platformDatas, setPlatformDatas] = useState(platformData);

  useEffect(() => {
    setPlatformDatas(platformData);
  }, [platformData]);

  const getPlatformData = (index) => {
    if (platformDatas.length > 0) {
      return platformDatas[index];
    } else {
      return {
        currentStation: "南港",
        stationsWillArrive: [],
        isSouthbound: true,
        trainData: {
          number: "",
          to: "",
          departureTime: "",
          freeSeat: "",
        },
      };
    }
  };

  return (
    <div className="min-w-0 flex-1 bg-gray-900 p-2">
      <div>{child}</div>
      <PlatformCard {...getPlatformData(0)}></PlatformCard>

      <div className="mb-1 mt-2.5 text-xl font-bold text-white">
        <marquee>
          列車即將進站，請不要靠近月台邊。並請您在上車時月台與車廂的高低落差及間距，以免發生危險，祝您旅途愉快。
        </marquee>
      </div>

      <PlatformCard {...getPlatformData(1)}></PlatformCard>
    </div>
  );
}

export default BoundCard;
