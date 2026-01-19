import { ApolloError } from "apollo-server-errors";
import { Guest, IGuest, IGuestDeleteOutput, IGuestUpdateInput } from "./guest.model";
import { mapUpdates } from "../../utils/queries";

export const guestService = {
    createGuest: async ({ guestListId, projectId, name, type, side }: { guestListId: string, projectId: string, name: string, type: string, side: string }): Promise<IGuest> => {
        if (guestListId === '') throw new ApolloError('No guest list id provided.', 'BAD_USER_INPUT');
        if (projectId === '') throw new ApolloError('No project id provided.', 'BAD_USER_INPUT');

        const guest = Guest.create({ guestListId, projectId, name, type, side });
        return guest;
    },
    updateGuest: async ({ id, updateInput }: { id: string, updateInput: IGuestUpdateInput }): Promise<IGuest | null> => {
        if (!updateInput) throw new ApolloError('No data provided.', 'BAD_USER_INPUT');
        if (!id) throw new ApolloError('No id provided.', 'BAD_USER_INPUT');

        const ALLOWED_FIELDS = ['name', 'type', 'side'];
        const updates = mapUpdates(updateInput, ALLOWED_FIELDS);

        if (Object.keys(updates).length === 0) return Guest.findById(id);

        const result = await Guest.findByIdAndUpdate( id, { $set: updateInput }, { new: true });
        return result;
    },
    deleteGuest: async ({ id }: { id: string }): Promise<IGuestDeleteOutput> => {
        if (!id) throw new ApolloError('No id provided.', 'BAD_USER_INPUT');

        const deleted = await Guest.findByIdAndDelete(id);
        if (!deleted) throw new ApolloError('Guest not found.', 'NOT_FOUND');

        return {
            _id: id,
            success: true
        }
    }
}