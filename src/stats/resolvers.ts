import { getNumCorrectAnswers } from '../db-client'

type CorrectAnswerArgs = {
  day: number
}

export default {
  Query: {
    async correctAnswers(_parent: undefined, args: CorrectAnswerArgs) {
      return await getNumCorrectAnswers(args.day)
    }
  },
}
