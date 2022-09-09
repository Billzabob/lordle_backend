import { gql } from 'apollo-server-lambda'

export default gql`
  enum CardType {
    Landmark
    Spell
    Unit
    Equipment
  }

  enum Rarity {
    Champion
    COMMON
    EPIC
    RARE
  }

  enum Region {
    BandleCity
    Bilgewater
    Demacia
    Freljord
    Ionia
    Noxus
    PiltoverZaun
    Runeterra
    ShadowIsles
    Shurima
    Targon
  }

  enum Set {
    Set1
    Set2
    Set3
    Set4
    Set5
    Set6
    Set6cde
  }

  type Card {
    cardCode: String!
    name: String!
    regionRefs: [Region!]!
    rarity: Rarity!
    type: CardType!,
    image: String!
  }

  extend type Query {
    cards: [Card!]!
    card(daysBack: Int!): Card!
    allDays: [[String!]!]!
  }

  extend type Mutation {
    setCards(day: Int!, cards: [String!]!): [String!]!
  }
`