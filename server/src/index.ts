import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs, resolvers } from "./schema";
import { buildContext } from "./context";
import { connectDB } from "./config/db";

const startServer = async () => {
  await connectDB();
  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
    context: buildContext,
  });

  console.log(`🚀 Server ready at ${url}`);
}

startServer();