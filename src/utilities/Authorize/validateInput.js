import { inputValidators } from "../../data/inputValidators";

export default function validateInput(inpField, input, setErrorMessages) {
  const capName = `${inpField[0].toUpperCase()}${inpField.slice(1)}`;
  const inpVal = input[inpField];
  if (inpVal.length < 1) {
    console.log(`${capName}: ${inpVal}`);
    setErrorMessages((prevMessages) => ({
      ...prevMessages,
      [inpField]: `${capName} can't be empty.`,
    }));
    return false;
  } else if (
    inpVal.length < inputValidators[inpField].minLength ||
    inpVal.length > inputValidators[inpField].maxLength
  ) {
    setErrorMessages((prevMessages) => ({
      ...prevMessages,
      [inpField]: `${capName} must be between ${inputValidators[inpField].minLength} & ${inputValidators[inpField].maxLength} characters.`,
    }));
    return false;
  } else if (!inputValidators[inpField].patternRegEx.test(inpVal)) {
    setErrorMessages((prevMessages) => ({
      ...prevMessages,
      [inpField]: `${capName} must be ${inputValidators[inpField].patternText}`,
    }));
    return false;
  } else {
    setErrorMessages((prevMessages) => ({
      ...prevMessages,
      [inpField]: "",
    }));
    return true;
  }
}
