export const validateName = string => {
  if (!string) return 'Field is required';
  return '';
};
export const validateSpecification = string => {
  if (!string) return 'Field is required';
  if (string.length > 500) return 'Too long!';
  return '';
};
export const validateJoinedDate = (joinedDate, dob) => {
  var birthDate = new Date(dob);
  var jDate = new Date(joinedDate);
  if (!joinedDate) {
    return 'Enter joined date';
  }
  return '';
};
export const validateCategory = type => {
  if (!type) return 'Type is empty! Please choose type';
  return '';
};
