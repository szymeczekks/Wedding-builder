import { ApolloError } from "apollo-server-errors";
import { Project, IProject } from "./project.model";
import mongoose from "mongoose";
import { Guests, IGuests } from "../guests/guests.model";

export const ProjectService = {
    createProject: async ({ userId, sessionId }: { userId?: string, sessionId?: string }): Promise<IProject> => {
        const project = await Project.create({
            creator: userId ?? null, 
            sessionId: sessionId ?? null,
        });

        await Guests.create({
            projectId: project._id.toString(),
        });

        return project;
    },
    getProjects: async ({ userId, sessionId }: { userId?: string, sessionId?: string }):Promise<IProject[]> => {
        let projects:IProject[] = [];

        if (userId) {
            projects = await Project.find({ creator: userId }).lean();
        }
        
        if (sessionId) {
            projects = await Project.find({ sessionId }).lean();
        }

        return projects;
    },
    getProject: async ({ id, userId, sessionId }: { id: string, userId?: string, sessionId?: string }):Promise<IProject | null> => {
        if (!id) throw new ApolloError('No id provided.', 'BAD_USER_INPUT');
        if (!mongoose.Types.ObjectId.isValid(id)) throw new ApolloError('Invalid ID.', 'BAD_USER_INPUT');

        let project:IProject | null = null;

        if (userId) {
            project = await Project.findOne({ creator: userId, _id: id }).lean();
        }
        
        if (sessionId) {
            project = await Project.findOne({ sessionId, _id: id }).lean();
        }

        if (!project) return null;

        const guestsList = await Guests.findOne({ projectId: project?._id }).lean();

        return {
            ...project,
            groomName: guestsList?.items?.find(g => g.type === 'groom')?.name || null,
            brideName: guestsList?.items?.find(g => g.type === 'bride')?.name || null,
        };
    }
};