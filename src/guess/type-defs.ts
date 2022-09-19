import { gql } from 'apollo-server-lambda'

export default gql`
  enum Result {
    CORRECT
    WRONG
  }

  enum ResultPartial {
    CORRECT
    WRONG
    PARTIAL
  }

  enum ResultUpDown {
    CORRECT
    UP
    DOWN
  }

  type RegionResult {
    regions: [Region]
    result: ResultPartial
  }

  type RarityResult {
    rarity: Rarity
    result: Result
  }

  type ManaCostResult {
    manaCost: Int
    result: ResultUpDown
  }

  type CardTypeResult {
    type: CardType
    result: Result
  }

  type SetResult {
    set: Set
    result: Result
  }

  type Guess {
    cardCode: String!
    regionResult: RegionResult!
    rarityResult: RarityResult!
    manaCostResult: ManaCostResult!
    typeResult: CardTypeResult!
    setResult: SetResult!
    correct: Boolean!
    image: String!
    otherCards: [Card!]
  }

  extend type Query {
    guess(code: String!): Guess!
  }
`