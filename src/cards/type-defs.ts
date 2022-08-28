import { gql } from 'apollo-server-lambda'

export default gql`
  enum CardType {
    Ability
    Landmark
    Spell
    Trap
    Unit
    Equipment
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
    CallOfTheMountain
    MonumentsOfPower
    KDAAllOut
    CosmicCreation
    Aphelios
    EmpiresOfTheAscended
    GuardiansOfTheAncient
    RiseOfTheUnderworlds
    SentinelsOfLight
    BeyondTheBandlewood
    ThePathOfChampions
    MagicMisadventures
    ACuriousJourney
    v34CardExpansion
    v36CardExpansion
    Worldwalker
    ForcesFromBeyond
    TheDarkinSagaAwakening
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
`