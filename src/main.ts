import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import cardResolver from './cards/resolvers.js';
import cardTypeDefs from './cards/typedefs.js';
import guessResolver from './guess/resolvers.js';
import guessTypeDefs from './guess/typedefs.js';

const query = gql`type Query`

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs: [query, cardTypeDefs, guessTypeDefs],
  resolvers: [cardResolver, guessResolver],
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

// The `listen` method launches a web server.
server.listen(process.env.PORT || 8081).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});