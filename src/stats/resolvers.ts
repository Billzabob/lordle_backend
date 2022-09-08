import { getNumCorrectAnswers, incrementCorrectAnswers } from '../db-client'

type DayArg = {
  day: number
}

export default {
  Query: {
    async correctAnswers(_parent: undefined, args: DayArg) {
      return await getNumCorrectAnswers(args.day)
    }
  },
  Mutation: {
    async incrementCorrectAnswers(_parent: undefined, args: DayArg) {
      return await incrementCorrectAnswers(args.day)
    }
  }
}
