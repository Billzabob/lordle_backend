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
    Set7
    Set7b
    Set8
  }

  type Card {
    cardCode: String!
    name: String!
    regionRefs: [Region!]!
    rarity: Rarity!
    type: CardType!
    image: String!
    backgroundImage: String!
    language: String!
  }

  extend type Query {
    cards(language: Language): [Card!]!
    cardsForDay(day: Int!, language: Language): [Card!]!
    allDays: [[String!]!]!
  }
`