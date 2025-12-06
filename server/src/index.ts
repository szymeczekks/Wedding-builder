import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs, resolvers } from "./schema";
import { buildContext } from "./context";
import { connectDB } from "./config/db";
import { permissions } from "./permissions/permissions";
import { applyMiddleware } from "graphql-middleware";
import { makeExecutableSchema } from "@graphql-tools/schema";

const startServer = async () => {
  await connectDB();
  const server = new ApolloServer({
    schema: applyMiddleware(makeExecutableSchema({ typeDefs, resolvers }), permissions)
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
    context: buildContext,
  });

  console.log(`🚀 Server ready at ${url}`);
}

startServer();