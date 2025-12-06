import { ApolloError } from 'apollo-server-errors';
import { rule } from 'graphql-shield';
import { MyContext } from '../context';

export const checkIdentity = (ctx: MyContext) => {
  if (!ctx.user?.id && !ctx.sessionId) throw new ApolloError('No identity found.', 'UNAUTHENTICATED');
  return true;
};

export const isAuthenticated = rule()(async (parent, args, ctx, info) => {
  return checkIdentity(ctx);
});