import { gql } from 'apollo-server-lambda'

export default gql`
  extend type Query {
    nextCardTimeSeconds: Int!
    currentDay: Int!
  }
`