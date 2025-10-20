import { MyContext } from "../../types";
import { Component } from "./components.model";
import { componentsServices } from "./components.service";

export const componentsResolvers = {
    Component: {
        id: (component: any) => component._id.toString()
    },
    Mutation: {
        createComponent: async(_:unknown, { name, props }: { name: string, props: string[] }, context: MyContext) => {
            return componentsServices.createComponent({ name, props, userId: context.userId });
        },
        updateComponent: async(_:unknown, { input }: { input: {id: string, name: string, props: string[] } }, context: MyContext) => {
            return componentsServices.updateComponent({ ...input, userId: context.userId });
        }
    },
    Query: {
        getComponents: async(_:unknown, args: {}, context: MyContext) => {
            return componentsServices.getComponents({ userId: context.userId });
        },
        getComponentsByCreator: async(_:unknown, args: {}, context: MyContext) => {
            return componentsServices.getComponentsByCreator({ userId: context.userId });
        }
    }
}