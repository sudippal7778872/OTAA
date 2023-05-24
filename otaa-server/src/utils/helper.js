exports.getUniqueFileName = (fileName) => {
  const currentDateTime = new Date();
  const day = currentDateTime.getDate();
  const month = currentDateTime.getMonth() + 1;
  const year = currentDateTime.getFullYear();
  const hour = currentDateTime.getHours();
  const minute = currentDateTime.getMinutes();
  const second = currentDateTime.getSeconds();
  const milisecond = currentDateTime.getMilliseconds();
  const fileNameSuffix =
    day +
    "" +
    month +
    "" +
    year +
    "" +
    hour +
    "" +
    minute +
    "" +
    second +
    "" +
    milisecond;

  return fileName + fileNameSuffix + ".pcap";
};
