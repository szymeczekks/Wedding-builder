import { ApolloError } from "apollo-server-errors";
import { Website, IWebsite } from "./website.model";
import validator from 'validator';

export const WebsiteService = {
    createWebsite: async ({ name, userId, sessionId }: { name: string, userId?: string, sessionId?: string }):Promise<IWebsite> => {
        if (!validator.isLength(name, { min: 3 })) throw new ApolloError('Name should have at least 3 characters.', 'BAD_USER_INPUT');

        const website = await Website.create({ 
            name, 
            creator: userId ?? null, 
            sessionId: sessionId ?? null 
        });

        return website;
    },
    getWebsites: async ({ userId, sessionId }: { userId?: string, sessionId?: string }):Promise<IWebsite[]> => {
        let websites:IWebsite[] = [];

        if (userId) {
            websites = await Website.find({ creator: userId }).lean();
        }
        
        if (sessionId) {
            websites = await Website.find({ sessionId }).lean();
        }

        return websites;
    }
};