import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { authTypeDefs } from './modules/auth/auth.typeDefs';
import { authResolvers } from './modules/auth/auth.resolvers';
import { widgetsTypeDefs } from './modules/widgets/widgets.typeDefs';
import { widgetResolvers } from './modules/widgets/widgets.resolvers';
import { websiteTypeDefs } from './modules/website/website.typeDefs';
import { websiteResolvers } from './modules/website/website.resolvers';

export const typeDefs = mergeTypeDefs([authTypeDefs, widgetsTypeDefs, websiteTypeDefs]);
export const resolvers = mergeResolvers([authResolvers, widgetResolvers, websiteResolvers]);