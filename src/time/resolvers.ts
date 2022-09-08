import dayjs  from 'dayjs'
import { currentDay } from '../util'

export default {
  Query: {
    nextCardTimeSeconds() {
      const now = dayjs()
      return now.endOf('day').add(7, 'hours').diff(now, 'seconds')
    },
    currentDay() {
      return currentDay()
    }
  },
}
