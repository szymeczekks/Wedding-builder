import { UpdateGuestListInput } from "./guestList.model";
import { guestListService } from "./guestList.service"

export const guestListResolvers = {
    Mutation: {
        createGuestList: async (_: any, { projectId, name }: { projectId: string, name: string }, __: any) => {
            return guestListService.createGuestList({ projectId, name });
        },
        updateGuestList: async (_: any, { guestListId, dataInput }: { guestListId: string, dataInput: UpdateGuestListInput }, __: any) => {
            return guestListService.updateGuestList( guestListId, dataInput );
        },
        deleteGuestList: async (_: any, { guestListId }: { guestListId: string }, __: any) => {
            return guestListService.deleteGuestList( guestListId );
        }
    },
    Query: {
        getGuestLists: async (_: any, { projectId }: { projectId: string }, __: any) => {
            return guestListService.getGuestLists(projectId);
        }
    }
}