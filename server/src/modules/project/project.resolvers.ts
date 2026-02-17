import { MyContext } from "../../context";
import { IChecklistStageUpdateInput, ICheckListTodoCreateInput, IChecklistTodoInput, IProjectCeremonyInput } from "./project.model";
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
        },
        updateTodo: async (_:any, { projectId, stageId, todoId, input }: { projectId: string, stageId: string, todoId: string, input: IChecklistTodoInput }, __:any) => {
            return ProjectService.updateTodo({ projectId, stageId, todoId, input });
        },
        updateStage: async (_:any, { projectId, stageId, input }: { projectId: string, stageId: string, input: IChecklistStageUpdateInput }, __:any) => {
            return ProjectService.updateStage({ projectId, stageId, input });
        },
        deleteTodo: async (_:any, { projectId, stageId, todoId }: { projectId: string, stageId: string, todoId: string }, __:any) => {
            return ProjectService.deleteTodo({ projectId, stageId, todoId });
        },
        deleteStage: async (_:any, { projectId, stageId }: { projectId: string, stageId: string }, __:any) => {
            return ProjectService.deleteStage({ projectId, stageId });
        },
        createStage: async (_:any, { projectId, title }: { projectId: string, title: string }, __:any) => {
            return ProjectService.createStage({ projectId, title });
        },
        createTodo: async (_:any, { projectId, stageId, input }: { projectId: string, stageId: string, input: ICheckListTodoCreateInput }, __:any) => {
            return ProjectService.createTodo({ projectId, stageId, input });
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