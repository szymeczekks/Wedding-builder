import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { authTypeDefs } from './modules/auth/auth.typeDefs';
import { authResolvers } from './modules/auth/auth.resolvers';
import { widgetsTypeDefs } from './modules/widgets/widgets.typeDefs';
import { widgetResolvers } from './modules/widgets/widgets.resolvers';
import { websiteTypeDefs } from './modules/website/website.typeDefs';
import { websiteResolvers } from './modules/website/website.resolvers';
import { projectResolvers } from './modules/project/project.resolvers';
import { projectTypeDefs } from './modules/project/project.typeDefs';
import { guestListResolvers } from './modules/guestList/guestList.resolvers';
import { guestListTypeDefs } from './modules/guestList/guestList.typeDefs';
import { guestTypeDefs } from './modules/guest/guest.typeDefs';
import { guestResolvers } from './modules/guest/guest.resolvers';

export const typeDefs = mergeTypeDefs([authTypeDefs, widgetsTypeDefs, websiteTypeDefs, projectTypeDefs, guestTypeDefs, guestListTypeDefs]);
export const resolvers = mergeResolvers([authResolvers, widgetResolvers, websiteResolvers, projectResolvers, guestResolvers, guestListResolvers]);