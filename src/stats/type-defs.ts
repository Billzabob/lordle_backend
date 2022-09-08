import { gql } from 'apollo-server-lambda'

export default gql`
  extend type Query {
    correctAnswers(day: Int!): Int!
  }
  extend type Mutation {
    incrementCorrectAnswers(day: Int!): Int
  }
`