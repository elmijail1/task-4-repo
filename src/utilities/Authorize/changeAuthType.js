export default function changeAuthType(setAuthType) {
  setAuthType((prevType) => {
    if (prevType === "login") {
      return "signup";
    } else if (prevType === "signup") {
      return "login";
    }
  });
}
