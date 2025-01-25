export default function registerFocus(event, firstFocus, setFirstFocus) {
  if (!firstFocus[event.target.name]) {
    setFirstFocus((prevFocus) => ({ ...prevFocus, [event.target.name]: true }));
  }
}
