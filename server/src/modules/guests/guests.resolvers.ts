import { GuestsService } from "./guests.service"

export const GuestsResolvers = {
    Query: {
        getGuests: async () => {
            return GuestsService.getGuests();
        }
    }
}