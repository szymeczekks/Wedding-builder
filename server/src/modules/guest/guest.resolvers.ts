import { IGuestUpdateInput } from "./guest.model";
import { guestService } from "./guest.service"

export const guestResolvers = {
    Query: {},
    Mutation: {
        createGuest: async (_: any, { input: { guestListId, projectId, name, type, side } }: {input : { guestListId: string, projectId: string, name: string, type: string, side: string }}, __: any) => {
            return guestService.createGuest({ guestListId, projectId, name, type, side });
        },
        updateGuest: async (_: any, { id, updateInput }: { id: string, updateInput: IGuestUpdateInput }, __: any) => {
            return guestService.updateGuest({ id, updateInput });
        },
        deleteGuest: async (_: any, { id }: { id: string }, __: any) => {
            return guestService.deleteGuest({ id });
        }
    }
}