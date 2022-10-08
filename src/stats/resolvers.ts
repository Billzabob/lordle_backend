import { getNumCorrectAnswers, getNumCorrectVoiceAnswers} from '../db-client'
import { currentDay } from '../util'

type DayArg = {
  day: number
}

export default {
  Query: {
    async correctAnswers(_parent: undefined, args: DayArg) {
      const day = args.day === undefined ? currentDay() : args.day
      return getNumCorrectAnswers(day)
    },
    async correctVoiceAnswers(_parent: undefined, args: DayArg) {
      const day = args.day === undefined ? currentDay() : args.day
      return getNumCorrectVoiceAnswers(day)
    },
  }
}
