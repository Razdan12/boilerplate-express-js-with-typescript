import moment from 'moment';

export function isInteger(value: string): boolean {
  return /^\d+$/.test(value);
}

export function isBoolean(value: string): boolean {
  return value === 'true' || value === 'false';
}

export function isDateAble(value: string): boolean {
  return moment(value).isValid();
}

export function isObject(variable: any): variable is object {
  return typeof variable === 'object' && variable !== null;
}

export function parseString(val: string): string | number | boolean | null {
  if (val === 'null') {
    return null;
  }
  if (val === 'true') {
    return true;
  }
  if (val === 'false') {
    return false;
  }
  if (!isNaN(Number(val))) {
    return Number(val);
  }
  return val;
}