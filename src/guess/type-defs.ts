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
    name: String!
    language: String!
  }

  enum Language {
    de_de
    en_us
    es_es
    es_mx
    fr_fr
    it_it
    ja_jp
    ko_kr
    pl_pl
    pt_br
    th_th
    tr_tr
    ru_ru
    zh_tw
  }

  extend type Query {
    guess(code: String!, day: Int!, language: Language): Guess!
  }
`