const CardInfo = (props) => {
  const { title = "", isDest = false } = props;
  const child = props.children;

  return (
    <div className="flex w-full items-center text-lg font-bold text-white">
      <div className="w-2/5 max-w-[100px] flex-none">{title}</div>
      <div className="flex-1 text-2xl">{child}</div>
    </div>
  );
};

export default CardInfo;
