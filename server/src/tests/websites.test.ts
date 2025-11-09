import { ApolloServer } from '@apollo/server';
import { typeDefs, resolvers } from '../schema';
import { execQuery, execQueryError } from '../utils/testing';
import { Website } from '../modules/website/website.model';
import { websiteResolvers } from '../modules/website/website.resolvers';
import { ApolloError } from 'apollo-server-errors';

jest.mock('../modules/website/website.model');

const mockWebsite = {
	_id: "123",
	creator: "68c69c4344abb13b45078a69",
	name: "Moja ślubna strona internetowa",
};

describe('Website', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

    describe('Website: create', () => {
        it('should create new website', async () => {
            (Website.create as jest.Mock).mockResolvedValue(mockWebsite);

			const result = await websiteResolvers.Mutation.createWebsite(null, { name: "Moja ślubna strona internetowa" }, { user: { id: "68c69c4344abb13b45078a69", email: "", role: ""}});

			expect(result).toEqual(mockWebsite);
			expect(Website.create).toHaveBeenCalledTimes(1);
        });

        it('should return error when name is empty', async () => {
			try {
				await websiteResolvers.Mutation.createWebsite(null, { name: "" }, { user: { id: "68c69c4344abb13b45078a69", email: "", role: ""}});
				fail('Expected ApolloError');
			} catch (error) {
				if (error instanceof ApolloError) {
					expect(error).toBeInstanceOf(ApolloError);
					expect(error.extensions.code).toBe('BAD_USER_INPUT');
				} else {
					throw error;
				}
			}
        });

        it('should return error when user is not authenticated', async () => {
			try {
				await websiteResolvers.Mutation.createWebsite(null, { name: "New page" }, { user: { id: "", email: "", role: ""}});
				fail('Expected ApolloError');
			} catch (error) {
				if (error instanceof ApolloError) {
					expect(error).toBeInstanceOf(ApolloError);
					expect(error.extensions.code).toBe('UNAUTHENTICATED');
				} else {
					throw error;
				}
			}
        });
    });

	describe('Website: get', () => {
		it('should return every website by creator', async () => {
			(Website.find as jest.Mock).mockReturnValue({
				lean: jest.fn().mockResolvedValue([mockWebsite]),
			});

			const result = await websiteResolvers.Query.getWebsites(null, null, { user: { id: "68c69c4344abb13b45078a69", email: "", role: ""}});

			expect(result).toEqual([mockWebsite]);
			expect(Website.find).toHaveBeenCalledTimes(1);
		});

		it('should return error when user is not authenticated', async () => {
			try {
				await websiteResolvers.Query.getWebsites(null, null, { user: { id: "", email: "", role: ""}});
				fail('Expected ApolloError');
			} catch (error) {
				if(!(error instanceof ApolloError)) throw error;
				expect(error).toBeInstanceOf(ApolloError);
				expect(error.extensions.code).toBe('UNAUTHENTICATED');
			}
		});
	});
});
