import { Website } from '../../modules/website/website.model';
import { websiteResolvers } from '../../modules/website/website.resolvers';
import { ApolloError } from 'apollo-server-errors';

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
		it('should return error when name is empty', async () => {
			await expect(
				websiteResolvers.Mutation.createWebsite(
					null,
					{ name: "" },
					{ user: { id: "68c69c4344abb13b45078a69", email: "", role: "" } }
				)
			).rejects.toMatchObject({
				extensions: { code: "BAD_USER_INPUT" }
			});
		});
		
        it('should create new website', async () => {
            (Website.create as jest.Mock).mockResolvedValue(mockWebsite);

			const result = await websiteResolvers.Mutation.createWebsite(null, { name: "Moja ślubna strona internetowa" }, { user: { id: "", email: "", role: ""}, sessionId: "test"});

			expect(result).toEqual(mockWebsite);
			expect(Website.create).toHaveBeenCalledTimes(1);
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
	});
});
