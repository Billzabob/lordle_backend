import { gql } from 'apollo-server';

export default gql`
  enum Result {
    CORRECT
    WRONG
    PARTIAL
  }

  type RegionResult {
    regions: [Region]
    result: Result
  }

  type RarityResult {
    rarity: Rarity
    result: Result
  }

  type ManaCostResult {
    manaCost: Int
    result: Result
  }

  type CardTypeResult {
    type: CardType
    result: Result
  }

  type ExpansionResult {
    expansion: Expansion
    result: Result
  }

  type Guess {
    regionResult: RegionResult
    rarityResult: RarityResult
    manaCostResult: ManaCostResult
    typeResult: CardTypeResult
    expansionResult: ExpansionResult
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  extend type Query {
    guess(code: String!): Guess
  }
`;