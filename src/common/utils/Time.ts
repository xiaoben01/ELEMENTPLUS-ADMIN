/**
 * @description: 格式化时间
 * @param {time} time
 * @return {*} 2021-01-01 00:00:00
 */
export function formatTime(time: number, cFormat?: string): string {
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  const date = new Date(time * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  interface FormatObj {
    [key: string]: string | number;
  }
  const formatObj: FormatObj = {
    y: year,
    m: month.toString().padStart(2, '0'),
    d: day.toString().padStart(2, '0'),
    h: hour.toString().padStart(2, '0'),
    i: minute.toString().padStart(2, '0'),
    s: second.toString().padStart(2, '0')
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    return value.toString().padStart(2, '0');
  });
  return time_str;
}
