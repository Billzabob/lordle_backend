import { gql } from 'apollo-server';

export default gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  enum Type {
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

  type Card {
    cardCode: String
    name: String
    regionRefs: [Region]
    rarity: Rarity
    type: Type
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    cards: [Card]
  }
`;