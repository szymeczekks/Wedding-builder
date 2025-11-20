import { MyContext } from "../../context";
import { ProjectService } from "./project.service";

export const projectResolvers = {
    Mutation: {
        createProject: async (_:any, __:any, context: MyContext) => {
            return ProjectService.createProject({ userId: context?.user?.id, sessionId: context?.sessionId });
        }
    },
    Query: {
        getProjects: async (_: any, __: any, context: MyContext) => {
            return ProjectService.getProjects({ userId: context?.user?.id, sessionId: context?.sessionId })
        }
    }
};