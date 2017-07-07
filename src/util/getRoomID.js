import queryString from 'query-string'

global.queryString = queryString

export default function getRoomID () {
  const parsedSearchQuery = queryString.parse(window.location.search)
  return parsedSearchQuery.room ? parsedSearchQuery.room.toUpperCase() : ''
}
