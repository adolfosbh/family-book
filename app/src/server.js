import 'dotenv/config'
import { ApolloServer } from 'apollo-server'
import parseBearerToken from 'parse-bearer-token'
import typeDefs from './graphql/types'
import resolvers from './graphql/resolvers'
import { checkToken } from './utils/login'

// authenticate for schema usage
const context = ({ req }) => {
  const userToken = parseBearerToken(req)
  if (userToken) {
      const {ok, error, user} = checkToken(userToken)
      if (!ok) {
        throw new Error(error.code);
      }
      return { userUUID: user.uuid }
  }
  return { }
};

const server = new ApolloServer({ typeDefs, resolvers , context });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});