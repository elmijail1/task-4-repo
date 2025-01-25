export default function typeDate(timestamp) {
  const date = timestamp.toDate();
  return `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}`;
}
