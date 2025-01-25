import { inputValidators } from "../../../data/inputValidators";

export default function validateInput(inpField, input, setUserStatus) {
  const capName = `${inpField[0].toUpperCase()}${inpField.slice(1)}`;
  const inpVal = input[inpField];
  if (inpVal.length < 1) {
    return `${capName} can't be empty.`;
  } else if (
    inpVal.length < inputValidators[inpField].minLength ||
    inpVal.length > inputValidators[inpField].maxLength
  ) {
    return `${capName} must be between ${inputValidators[inpField].minLength} & ${inputValidators[inpField].maxLength} characters.`;
  } else if (!inputValidators[inpField].patternRegEx.test(inpVal)) {
    setUserStatus("not validated");
    return `${capName} must be ${inputValidators[inpField].patternText}`;
  }
}
