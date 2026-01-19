import { ApolloError } from "apollo-server-errors";
import { Project, IProject, IProjectCeremonyInput, IProjectCeremony } from "./project.model";
import mongoose from "mongoose";
import { GuestList, IGuestList } from "../guestList/guestList.model";
import { Guest, IGuest } from "../guest/guest.model";

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
        const ceremonyId = new mongoose.Types.ObjectId();
        const receptionId = new mongoose.Types.ObjectId();
        const session = await mongoose.startSession();
        
        try {
            session.startTransaction();
            const project = await Project.create([{
                creator: userId ?? null, 
                sessionId: sessionId ?? null,
                ceremony: { _id: ceremonyId },
                reception: { _id: receptionId }
            }], { session });

    
            const initialGuestList = await GuestList.create([{ projectId: project[0]._id, name: "Para młoda", type: 'newlyweds' }], { session });
            await Guest.create([
                { name: null, type: 'bride', side: 'PARTNER_1', guestListId: initialGuestList[0]._id, projectId: project[0]._id },
                { name: null, type: 'groom', side: 'PARTNER_2', guestListId: initialGuestList[0]._id, projectId: project[0]._id }
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

        if (!project) return null;

        const bride = await Guest.find({ projectId: id, type: 'bride' });
        const groom = await Guest.find({ projectId: id, type: 'groom' });

        const newlyweds = [];
        if (bride) newlyweds.push(...bride); 
        if (groom) newlyweds.push(...groom); 

        return {
            ...project,
            newlyweds
        };
    },
    getProjectSummary: async ({ id, userId, sessionId }: { id: string, userId?: string, sessionId?: string }):Promise<IProject | null> => {
        if (!id) throw new ApolloError('No id provided.', 'BAD_USER_INPUT');
        if (!mongoose.Types.ObjectId.isValid(id)) throw new ApolloError('Invalid ID.', 'BAD_USER_INPUT');

        const project = await findProject(id, userId, sessionId);

        if (!project) return null;

        const bride = await Guest.find({ projectId: id, type: 'bride' });
        const groom = await Guest.find({ projectId: id, type: 'groom' });

        const newlyweds = [];
        if (bride) newlyweds.push(...bride); 
        if (groom) newlyweds.push(...groom); 

        return {
            ...project,
            newlyweds
        };
    },
    updateCeremony: async({ projectId, input }: { projectId: string, input: IProjectCeremonyInput }):Promise<IProjectCeremony | null> => {
        const update:any = {};
        Object.entries(input).forEach(([key, value]) => {
            if (value !== undefined) {
                update[`ceremony.${key}`] = value;
            }
        });

        if (Object.keys(update).length === 0) {
            throw new ApolloError('No values to update.', 'BAD_USER_INPUT');
        }

        const newProject = await Project.findByIdAndUpdate(
            projectId,
            { $set: update },
            { new: true }
        );

        return newProject?.ceremony || null;
    },
    updateReception: async({ projectId, input }: { projectId: string, input: IProjectCeremonyInput }):Promise<IProjectCeremony | null> => {
        const update:any = {};
        Object.entries(input).forEach(([key, value]) => {
            if (value !== undefined) {
                update[`reception.${key}`] = value;
            }
        });

        if (Object.keys(update).length === 0) {
            throw new ApolloError('No values to update.', 'BAD_USER_INPUT');
        }

        const newProject = await Project.findByIdAndUpdate(
            projectId,
            { $set: update },
            { new: true }
        );

        return newProject?.reception || null;
    }
};