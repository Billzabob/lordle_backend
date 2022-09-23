import { gql } from 'apollo-server-lambda'

export default gql`
  type Day {
    day: Int!
  }

  extend type Query {
    nextCardTimeSeconds: Int!
    currentDay: Day!
  }
`