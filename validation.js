// This function will check if the title is valid
export function checkTitleValidity(value) {
  const regex = /^\S(?:.*\S)?$/;
  return regex.test(value.trim());
}

// THis function will check if the number is valid
export function checkNumberValidity(value) {
  const regex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
  return regex.test(value);
}

// This function will check if the date is valid
export function checkDateValidity(value) {
  const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  return regex.test(value);
}

// This function will check if the tag is valid
export function checkTagValidity(value) {
  const regex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
  return regex.test(value.trim());
}
