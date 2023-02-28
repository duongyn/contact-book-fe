import dateformat from 'dateformat';
export const DATE_FORMAT = { createAssignment: 'dd/m/yyyy' };
export const convertStringToAssignmentDateStringFormat = inputString => {
  let parts = inputString.split('/');
  let newDate = new Date(parts[2], parts[1] - 1, parts[0]);
  return dateformat(newDate, 'yyyy-mm-dd');
};
export const converStringToUpdateAssignmentFormat = inputString => {
  if (inputString.match(/^(\d{4})-(\d{2})-(\d{2})\s\d{2}:\d{2}:\d{2}$/)) {
    return inputString;
  }
  let parts = inputString.split('-');
  let newDate = new Date(parts[0], parts[1] - 1, parts[2]);
  let result = dateformat(newDate, 'yyyy-mm-dd HH:MM:ss');
  return result;
};

export const formatDateStringFromViewAssignment = inputString => {
  return dateformat(new Date(inputString), 'yyyy-mm-dd').toString();
};
