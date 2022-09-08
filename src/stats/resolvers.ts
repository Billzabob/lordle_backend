import { getNumCorrectAnswers, incrementCorrectAnswers } from '../db-client'
import { currentDay } from '../util'

type DayArg = {
  day: number
}

export default {
  Query: {
    async correctAnswers(_parent: undefined, args: DayArg) {
      const day = args.day === undefined ? currentDay() : args.day
      return await getNumCorrectAnswers(day)
    }
  },
  Mutation: {
    async incrementCorrectAnswers(_parent: undefined, args: DayArg) {
      const day = args.day === undefined ? currentDay() : args.day
      return await incrementCorrectAnswers(day)
    }
  }
}
