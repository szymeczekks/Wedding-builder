import { rule } from 'graphql-shield';
import { MyContext } from '../context';

const checkIdentity = (ctx: MyContext) => {
  return Boolean(ctx.user?.id || ctx.sessionId);
};

export const isAuthenticated = rule()(async (parent, args, ctx, info) => {
  return checkIdentity(ctx);
});