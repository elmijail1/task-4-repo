export default function generateRightLengthPassword(input) {
  let rightLengthPassword = input.password;
  if (input.password.length < 6) {
    for (let i = 0; i < 6 - input.password.length; i++) {
      rightLengthPassword = rightLengthPassword + "0";
    }
  }
  return rightLengthPassword;
}
