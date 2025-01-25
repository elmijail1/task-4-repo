export default function typeDate(timestamp) {
  const date = timestamp.toDate();
  let minutes = date.getMinutes();
  if (String(minutes).length === 1) {
    minutes = `0${minutes}`;
  }

  return `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()} at ${date.getHours()}:${minutes}`;
}
