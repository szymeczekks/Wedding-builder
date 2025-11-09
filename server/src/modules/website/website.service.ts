import { ApolloError } from "apollo-server-errors";
import { Website, IWebsite } from "./website.model";
import validator from 'validator';

export const WebsiteService = {
    createWebsite: async ({ name, userId }: { name: string, userId?: string }):Promise<IWebsite> => {
        if (!userId) throw new ApolloError('User not found.', 'UNAUTHENTICATED');
        if (!validator.isLength(name, { min: 3 })) throw new ApolloError('Name should have at least 3 characters.', 'BAD_USER_INPUT');
        const website = await Website.create({ name, creator: userId });
        return website;
    },
    getWebsites: async ({ userId }: { userId?: string }):Promise<IWebsite[]> => {
        if (!userId) throw new ApolloError('User not found.', 'UNAUTHENTICATED');
        const websites = await Website.find({ creator: userId }).lean();
        return websites;
    }
};