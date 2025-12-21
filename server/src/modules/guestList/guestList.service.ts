import { ApolloError } from "apollo-server-errors";
import { DeleteGuestListOutput, GuestList, IGuestList, UpdateGuestListInput } from "./guestList.model";
import { mapUpdates } from "../../utils/queries";
import { Guest } from "../guest/guest.model";
import { Types } from "mongoose";

// const findGuests = async (projectId: string): Promise<IGuestList | null> => {
//     const guests = await GuestList.findOne({ projectId });
//     if (!guests) return null;
//     return guests;
// };

export const guestListService = {
    createGuestList: async ({ projectId, name }: { projectId: string, name: string }): Promise<IGuestList | null> => {
        if (name === '') throw new ApolloError('Name should not be empty.', 'BAD_USER_INPUT');
        if (projectId === '') throw new ApolloError('No project id provided.', 'BAD_USER_INPUT');
        
        const guestList = GuestList.create({ projectId, name });
        return guestList;
    },
    updateGuestList: async (guestListId: string, dataInput: UpdateGuestListInput): Promise<IGuestList | null> => {
        if (!dataInput) throw new ApolloError('No data provied.', 'BAD_USER_INPUT');
        if (guestListId === '') throw new ApolloError('GuestList ID should not be empty.', 'BAD_USER_INPUT');

        const ALLOWED_FIELDS = ['name'];
        const updates = mapUpdates(dataInput, ALLOWED_FIELDS);

        if (Object.keys(updates).length === 0) return GuestList.findById(guestListId);

        const result = GuestList.findByIdAndUpdate(guestListId, { $set: updates }, { new: true });
        return result;
    },
    deleteGuestList: async ( guestListId: string ): Promise<DeleteGuestListOutput> => {
        if (!guestListId) throw new ApolloError('No guest list id provided.', 'BAD_USER_INPUT');
        const deleted = await  GuestList.findByIdAndDelete( guestListId );

        if (!deleted) throw new ApolloError('Guest list not found.', 'NOT_FOUND');

        return {
            _id: guestListId,
            success: true
        }
    },
    getGuestLists: async (projectId: string): Promise<IGuestList[] | []> => {
        if (!projectId) throw new ApolloError('No project id provided.', 'BAD_USER_INPUT');
        const guestListsWithGuests = await GuestList.aggregate([
            { $match: { projectId: new Types.ObjectId(projectId) } },
            {
                $lookup: {
                    from: 'guests',
                    localField: '_id',
                    foreignField: 'guestListId',
                    as: 'guests'
                }
            }
        ]);

        const list = await GuestList.find({ projectId });
        const guests = await Guest.find({ projectId });
        return guestListsWithGuests;
    }
}