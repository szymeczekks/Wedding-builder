import { MyContext } from "../../context";
import { WebsiteService } from "./website.service";

export const websiteResolvers = {
    Mutation: {
        createWebsite: async (_:any, { name }: { name: string }, context: MyContext) => {
            return WebsiteService.createWebsite({ name, userId: context?.user?.id, sessionId: context?.sessionId });
        }
    },
    Query: {
        getWebsites: async (_:any, __:any, context: MyContext) => {
            // return WebsiteService.getWebsites({ userId: '68c69c4344abb13b45078a69' });
            return WebsiteService.getWebsites({ userId: context?.user?.id, sessionId: context?.sessionId });
        }
    }
};