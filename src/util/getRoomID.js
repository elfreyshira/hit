import queryString from 'query-string';

export default function getRoomID() {
  const parsedHash = queryString.parse(window.location.hash);
  return parsedHash.room.toUpperCase();
}
