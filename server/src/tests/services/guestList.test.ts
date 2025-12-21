import { guestListResolvers } from '../../modules/guestList/guestList.resolvers';
import { GuestList, IGuestList } from '../../modules/guestList/guestList.model';

const mockGuests = {
	_id: '68c69c4344abb13b45078a61',
	projectId: '68c69c4344abb13b45078a60',
	// items: [
	// 	{
	// 		name: 'Zuzanna Kujawska',
	// 		type: 'bride',
	// 		side: 'bride'
	// 	},
	// 	{
	// 		name: 'Szymon Mińko',
	// 		type: 'groom',
	// 		side: 'groom'
	// 	}
	// ]
};

const mockGuestListCreate = {
	_id: '68c69c4344abb13b45078a61',
	projectId: '68c69c4344abb13b45078a60',
	name: 'Lista gości',
};

const mockGuestListDelete = {
    _id: '68c69c4344abb13b45078a60',
    success: true
};

describe('GuestList', () => {
    beforeEach(() => {
		jest.clearAllMocks();
	});

    describe('GuestList: create', () => {
        it('it should throw error if name is empty string', async () => {
            await expect(guestListResolvers.Mutation.createGuestList(null, {projectId: '68c69c4344abb13b45078a60', name: ''}, null)).rejects.toMatchObject({
                extensions: { code: 'BAD_USER_INPUT' },
            });
        });

        it('it should throw error if projectId is empty string', async () => {
            await expect(guestListResolvers.Mutation.createGuestList(null, {projectId: '', name: 'Lista gości'}, null)).rejects.toMatchObject({
                extensions: { code: 'BAD_USER_INPUT' },
            });
        });

        it('it should return created data', async () => {
            (GuestList.create as jest.Mock).mockResolvedValue(mockGuestListCreate);
            const result = await guestListResolvers.Mutation.createGuestList(null, {projectId: '68c69c4344abb13b45078a60', name: 'Lista gości'}, null);
            
            expect(result).toEqual(mockGuestListCreate);
            expect(GuestList.create).toHaveBeenCalledTimes(1);
        });
    });

    describe('GuestList: update', () => {
        it('it should throw error if guestListId is empty string', async () => {
            await expect(guestListResolvers.Mutation.updateGuestList(null, {guestListId: '', dataInput: { name: 'Lista gości' }}, null)).rejects.toMatchObject({
                extensions: { code: 'BAD_USER_INPUT' },
            });
        });

        it('it should throw error if no dataInput is provided', async () => {
            await expect(guestListResolvers.Mutation.updateGuestList(null, { guestListId: '' } as any, null)).rejects.toMatchObject({
                extensions: { code: 'BAD_USER_INPUT' },
            });
        });

        it('it should return updated data', async () => {
            (GuestList.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockGuestListCreate);
            const result = await guestListResolvers.Mutation.updateGuestList(null, {guestListId: '68c69c4344abb13b45078a60', dataInput: { name: 'Lista gości' }}, null);
            
            expect(result).toEqual(mockGuestListCreate);
            expect(GuestList.findByIdAndUpdate).toHaveBeenCalledTimes(1);
        });

        it('it should return old object if dataInput is invalid', async () => {
            (GuestList.findById as jest.Mock).mockResolvedValue(mockGuestListCreate);
            const result = await guestListResolvers.Mutation.updateGuestList(null, {guestListId: '68c69c4344abb13b45078a60', dataInput: { guestListId: 'Lista gościii' }as any }, null);
            
            expect(result).toEqual(mockGuestListCreate);
            expect(GuestList.findById).toHaveBeenCalledTimes(1);
        });
    });

    describe('GuestList: delete', () => {
        it('it should throw error if guestListId is not provied', async () => {
            await expect(guestListResolvers.Mutation.deleteGuestList(null, {} as any, null)).rejects.toMatchObject({
                extensions: { code: 'BAD_USER_INPUT' },
            });
        });

        it('it should throw error if guest list not found', async () => {
            (GuestList.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
            await expect(guestListResolvers.Mutation.deleteGuestList(null, { guestListId: '68c69c4344abb13b45078a60' }, null)).rejects.toMatchObject({
                extensions: { code: 'NOT_FOUND' },
            });
        });

        it('it should return information after deleting', async () => {
            (GuestList.findByIdAndDelete as jest.Mock).mockResolvedValue(mockGuestListCreate);
            const result = await guestListResolvers.Mutation.deleteGuestList(null, { guestListId: '68c69c4344abb13b45078a60' }, null);
            
            expect(result).toEqual(mockGuestListDelete);
            expect(GuestList.findByIdAndDelete).toHaveBeenCalledTimes(1);
        });
    });

    describe('GuestLists: get', () => {
        it('it should throw error if projectId is not provided', async () => {
            await expect(guestListResolvers.Query.getGuestLists(null, {} as any, null)).rejects.toMatchObject({
                extensions: { code: 'BAD_USER_INPUT' },
            });
        });

        it('it should return data', async () => {
            (GuestList.find as jest.Mock).mockResolvedValue([mockGuestListCreate]);
            const result = await guestListResolvers.Query.getGuestLists(null, { projectId: '68c69c4344abb13b45078a60' }, null);
            
            expect(result).toEqual([mockGuestListCreate]);
            expect(GuestList.find).toHaveBeenCalledTimes(1);
        });
    });
});