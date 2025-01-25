export default function registerFocus(
  event,
  firstFocus,
  setFirstFocus,
  userStatus,
  setUserStatus
) {
  if (!firstFocus[event.target.name]) {
    setFirstFocus((prevFocus) => ({ ...prevFocus, [event.target.name]: true }));
  }

  if (userStatus === "not validated") {
    setUserStatus("");
    console.log(userStatus);
  }
}
