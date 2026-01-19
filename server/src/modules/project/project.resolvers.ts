import { MyContext } from "../../context";
import { IProjectCeremonyInput } from "./project.model";
import { ProjectService } from "./project.service";

export const projectResolvers = {
    Mutation: {
        createProject: async (_:any, __:any, context: MyContext) => {
            return ProjectService.createProject({ userId: context?.user?.id, sessionId: context?.sessionId });
        },
        updateCeremony: async (_:any, { projectId, input }: { projectId: string, input: IProjectCeremonyInput }, __:any) => {
            return ProjectService.updateCeremony({ projectId, input });
        },
        updateReception: async (_:any, { projectId, input }: { projectId: string, input: IProjectCeremonyInput }, __:any) => {
            return ProjectService.updateReception({ projectId, input });
        }
    },
    Query: {
        getProjects: async (_: any, __: any, context: MyContext) => {
            return ProjectService.getProjects({ userId: context?.user?.id, sessionId: context?.sessionId })
        },
        getProject: async (_: any, { id }: { id: string }, context: MyContext) => {
            return ProjectService.getProject({ id, userId: context?.user?.id, sessionId: context?.sessionId })
        },
        getProjectSummary: async (_: any, { id }: { id: string }, context: MyContext) => {
            return ProjectService.getProjectSummary({ id, userId: context?.user?.id, sessionId: context?.sessionId })
        }
    }
};