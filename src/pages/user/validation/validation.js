export const validateFirstName = string => {
  if (!string) return 'Please enter First Name';
  if (string.length > 50 || string.length < 1) return 'The name length should be 1 - 50 characters';
  if (!String(string).match('^[A-Za-z\\s]+$')) {
    return 'Name should not contain numbers, special characters and accented characters (e.g 123^%$Ââơô)';
  }
  if (string.match(' ')) return 'First name should not contain white spaces';

  if (string.length === 1) {
    if (!string.match('^[A-Z]*$')) {
      return 'Name should have first letter capital';
    } else {
      return '';
    }
  }
  if (!string.match('^[A-Z][a-z]+$')) {
    return 'Name should contain first upper case characters & the other lower case characters (e.g. Hoang, Minh)';
  }
  return '';
};

export const validateLastName = string => {
  if (!string) return 'Please enter Last Name';
  if (!String(string).match('^[A-Za-z\\s]+$')) {
    return 'Name should not contain numbers, special characters and accented characters (e.g 123^%$Ââơô)';
  }
  if (string.length < 1) return 'The name length should be 1 - 50 characters';
  if (string.length > 50) return 'The name length should be 1 - 50 characters';
  const stringArray = string.trim().split(' ');
  for (let i = 0; i < stringArray.length; i++) {
    if (stringArray[i].length === 1) {
      if (!stringArray[i].match('^[A-Z]*$')) {
        return 'Name should have first letter capital';
      } else {
        return '';
      }
    }
    if (!String(stringArray[i]).match('^[A-Z][a-z]+$')) {
      return 'Name should contain first upper case characters & the other lower case characters (e.g. Hoang, Minh)';
    }
  }

  return '';
};

export const validateDate = dob => {
  var today = new Date();
  var birthDate = new Date(dob);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (!dob) {
    return 'Please select Date of Birth';
  }
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  if (age < 18) {
    return 'User is under 18. Please select a different date';
  }
  return '';
};

export const validateJoinedDate = (joinedDate, dob) => {
  var birthDate = new Date(dob);
  var jDate = new Date(joinedDate);
  if (!joinedDate) {
    return 'Please select Joined Date';
  }
  if (jDate.getTime() > new Date().getTime()) {
    return 'Joined date must be present or past.';
  }
  if (jDate.getTime() < birthDate.getTime()) {
    return 'Joined date is not later than Date of Birth. Please select a different date';
  }
  if (jDate.getFullYear() - birthDate.getFullYear() < 18) {
    return 'User must be at least 18 years old to join.';
  }
  if (jDate.getDay() === 6 || jDate.getDay() === 0) {
    return 'Joined date is Saturday or Sunday. Please select a different date';
  }
  return '';
};

export const validateType = type => {
  if (!type) return 'Please select Type';
  return '';
};
