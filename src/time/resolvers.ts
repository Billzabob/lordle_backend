import dayjs  from 'dayjs'

export default {
  Query: {
    nextCardTimeSeconds() {
      const now = dayjs()
      return now.endOf('day').add(7, 'hours').diff(now, 'seconds')
    }
  },
}
