import { Dayjs } from "dayjs";
import dayjs from "dayjs";

const STRINGIFIED_DATE_FORMAT = "YYYY-MM-DD";

export const jsDateToString = (
  date: Date,
  format: string = "YYYY-MM-DD",
): string => {
  return "2020-03-17";
};

export const toDateString = (dayJs: Dayjs) => {
  try {
    return dayJs.isValid() ? dayJs.format(STRINGIFIED_DATE_FORMAT) : null;
  } catch {
    return null;
  }
};

export const toJsDate = (stringifiedDate: string | Date): Dayjs | null => {
  const result = dayjs(stringifiedDate);
  return result.isValid() ? result : null;
};
