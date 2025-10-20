import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { componentsTypeDefs } from './modules/components/components.typeDefs';
import { componentsResolvers } from './modules/components/components.resolvers';
import { authTypeDefs } from './modules/auth/auth.typeDefs';
import { authResolvers } from './modules/auth/auth.resolvers';
import { layoutTypeDefs } from './modules/layout/layout.typeDefs';
import { layoutResolvers } from './modules/layout/layout.resolvers';

export const typeDefs = mergeTypeDefs([authTypeDefs, layoutTypeDefs, componentsTypeDefs]);
export const resolvers = mergeResolvers([authResolvers, layoutResolvers, componentsResolvers]);