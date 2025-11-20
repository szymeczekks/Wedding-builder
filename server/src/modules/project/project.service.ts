import { ApolloError } from "apollo-server-errors";
import { Project, IProject } from "./project.model";

export const ProjectService = {
    createProject: async ({ userId, sessionId }: { userId?: string, sessionId?: string }): Promise<IProject> => {
        if (!userId && !sessionId) throw new ApolloError('No identity found.', 'UNAUTHENTICATED');

        const project = await Project.create({ 
            creator: userId ?? null, 
            sessionId: sessionId ?? null 
        });

        return project;
    },
    getProjects: async ({ userId, sessionId }: { userId?: string, sessionId?: string }):Promise<IProject[]> => {
        console.log(sessionId);
        if (userId) {
            return await Project.find({ creator: userId }).lean();
        }
        
        if (sessionId) {
            return await Project.find({ sessionId }).lean();
        }
        
        throw new ApolloError('No identity found.', 'UNAUTHENTICATED');
    }
};