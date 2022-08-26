import { gql } from 'apollo-server';

export default gql`
  enum CardType {
    Ability
    Landmark
    Spell
    Trap
    Unit
  }

  enum Rarity {
    None
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

  enum Expansion {
    Foundations
    RisingTides
  }

  type Card {
    cardCode: String
    name: String
    regionRefs: [Region]
    rarity: Rarity
    type: CardType
  }

  extend type Query {
    cards: [Card]
  }
`;