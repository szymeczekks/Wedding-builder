import { ApolloError } from "apollo-server-errors";
import { Project, IProject } from "./project.model";
import mongoose from "mongoose";
import { GuestList, IGuestList } from "../guestList/guestList.model";
import { Guest } from "../guest/guest.model";

const findProject = async (id: string, userId?: string, sessionId?: string): Promise<IProject | null> => {
    let project:IProject | null = null;

    if (userId) {
        project = await Project.findOne({ creator: userId, _id: id }).lean();
    }
    
    if (sessionId) {
        project = await Project.findOne({ sessionId, _id: id }).lean();
    }

    return project;
};

export const ProjectService = {
    createProject: async ({ userId, sessionId }: { userId?: string, sessionId?: string }): Promise<IProject> => {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            const project = await Project.create([{
                creator: userId ?? null, 
                sessionId: sessionId ?? null,
            }], { session });

    
            const initialGuestList = await GuestList.create([{ projectId: project[0]._id, name: "Para młoda" }], { session });
            await Guest.create([
                { name: null, type: 'groom', guestListId: initialGuestList[0]._id, projectId: project[0]._id },
                { name: null, type: 'bride', guestListId: initialGuestList[0]._id, projectId: project[0]._id }
            ], { session, ordered: true });


            await session.commitTransaction();
    
            return project[0];
        } catch (error) {
            await session.abortTransaction();
            throw new ApolloError('Nie udało się utworzyć projektu');
        } finally {
            session.endSession();
        }
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

        const project = await findProject(id, userId, sessionId);

        return project;
    },
    getProjectSummary: async ({ id, userId, sessionId }: { id: string, userId?: string, sessionId?: string }):Promise<IProject | null> => {
        if (!id) throw new ApolloError('No id provided.', 'BAD_USER_INPUT');
        if (!mongoose.Types.ObjectId.isValid(id)) throw new ApolloError('Invalid ID.', 'BAD_USER_INPUT');

        const project = await findProject(id, userId, sessionId);

        if (!project) return null;

        const groom = await Guest.findOne({ projectId: id, type: 'groom' });
        const bride = await Guest.findOne({ projectId: id, type: 'bride' });

        return {
            ...project,
            groomName: groom?.name || null,
            brideName: bride?.name || null,
        };
    }
};