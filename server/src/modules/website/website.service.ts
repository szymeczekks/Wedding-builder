import { ApolloError } from "apollo-server-errors";
import { Website, IWebsite } from "./website.model";
import validator from 'validator';

export const WebsiteService = {
    createWebsite: async ({ name, userId, sessionId }: { name: string, userId?: string, sessionId?: string }):Promise<IWebsite> => {
        if (!userId && !sessionId) throw new ApolloError('No identity found.', 'UNAUTHENTICATED');
        if (!validator.isLength(name, { min: 3 })) throw new ApolloError('Name should have at least 3 characters.', 'BAD_USER_INPUT');

        const website = await Website.create({ 
            name, 
            creator: userId ?? null, 
            sessionId: sessionId ?? null 
        });

        return website;
    },
    getWebsites: async ({ userId, sessionId }: { userId?: string, sessionId?: string }):Promise<IWebsite[]> => {
        if (userId) {
            return await Website.find({ creator: userId }).lean();
        }
        
        if (sessionId) {
            return await Website.find({ sessionId }).lean();
        }
        
        throw new ApolloError('No identity found.', 'UNAUTHENTICATED');
    }
};