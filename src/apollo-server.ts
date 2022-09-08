import { ApolloServer, gql } from 'apollo-server-lambda'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import cardResolver from './cards/resolvers'
import cardTypeDefs from './cards/type-defs'
import guessResolver from './guess/resolvers'
import guessTypeDefs from './guess/type-defs'
import statsResolver from './stats/resolvers'
import statsTypeDefs from './stats/type-defs'
import timeResolver from './time/resolvers'
import timeTypeDefs from './time/type-defs'

const query = gql`type Query`

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs: [query, cardTypeDefs, guessTypeDefs, statsTypeDefs, timeTypeDefs],
  resolvers: [cardResolver, guessResolver, statsResolver, timeResolver],
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
})

export const graphqlHandler = server.createHandler()
