import { layoutServices, UpdateLayoutInput } from "./layout.service";
import { MyContext } from "../../types";

export const layoutResolvers = {
    Mutation: {
        createLayout: async(_:unknown, { name }: { name: string }, context: MyContext) => {
            return layoutServices.createLayout({ userId: context.userId, name });
        },

        updateLayout: async(_:unknown, { id, layoutInput }: UpdateLayoutInput, context: MyContext) => {
            return layoutServices.updateLayout({ id, layoutInput, userId: context.userId });
        }
    }
}