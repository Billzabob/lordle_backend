import { gql } from 'apollo-server-lambda'

export default gql`
  type VoiceGuess {
    cardCode: String!
    correct: Boolean!
    image: String!
    name: String!
    language: String!
  }

  extend type Query {
    voiceLines(day: Int!): [String!]!
    guessVoice(day: Int!, code: String!, language: Language): VoiceGuess!
    voiceCardsForDay(day: Int!, language: Language): [Card!]!
  }
`