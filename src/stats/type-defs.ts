import { gql } from 'apollo-server-lambda'

export default gql`
  extend type Query {
    correctAnswers(day: Int): Int!
  }
`