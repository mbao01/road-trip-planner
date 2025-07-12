export const createTempId = (suffix?: string | number) => {
  return `::TEMP::-${suffix || Date.now()}`;
};
