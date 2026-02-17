import { ApolloError } from "apollo-server-errors";
import { Project, IProject, IProjectCeremonyInput, IProjectCeremony, IChecklistTodoInput, IChecklistTodo, ICheckListTodoDelete, IChecklistStageUpdateInput, IChecklistStage, ICheckListTodoCreateInput } from "./project.model";
import mongoose from "mongoose";
import { GuestList, IGuestList } from "../guestList/guestList.model";
import { Guest, IGuest } from "../guest/guest.model";
import { IDelete } from "../../types";

const findProject = async (id: string, userId?: string, sessionId?: string): Promise<IProject | null> => {
    let project: IProject | null = null;

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
            console.log(error);
            await session.abortTransaction();
            throw new ApolloError('Nie udało się utworzyć projektu');
        } finally {
            session.endSession();
        }
    },
    getProjects: async ({ userId, sessionId }: { userId?: string, sessionId?: string }): Promise<IProject[]> => {
        let projects: IProject[] = [];

        if (userId) {
            projects = await Project.find({ creator: userId }).lean();
        }

        if (sessionId) {
            projects = await Project.find({ sessionId }).lean();
        }

        return projects;
    },
    getProject: async ({ id, userId, sessionId }: { id: string, userId?: string, sessionId?: string }): Promise<IProject | null> => {
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
    getProjectSummary: async ({ id, userId, sessionId }: { id: string, userId?: string, sessionId?: string }): Promise<IProject | null> => {
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
    updateCeremony: async ({ projectId, input }: { projectId: string, input: IProjectCeremonyInput }): Promise<IProjectCeremony | null> => {
        const update: any = {};
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
    updateReception: async ({ projectId, input }: { projectId: string, input: IProjectCeremonyInput }): Promise<IProjectCeremony | null> => {
        const update: any = {};
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
    },
    updateTodo: async ({ projectId, stageId, todoId, input }: { projectId: string, stageId: string, todoId: string, input: IChecklistTodoInput }): Promise<IChecklistTodo | null> => {
        const update: any = {};
        Object.entries(input).forEach(([key, value]) => {
            if (key === 'title' && !value) {
                throw new ApolloError("Title can't be empty.", 'BAD_USER_INPUT');
            }

            if (value !== undefined) {
                update[`checklist.$[stage].todos.$[todo].${key}`] = value;
            }
        });

        if (Object.keys(update).length === 0) {
            throw new ApolloError('No values to update.', 'BAD_USER_INPUT');
        }

        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { $set: update },
            {
                new: true,
                arrayFilters: [
                    { 'stage._id': stageId },
                    { 'todo._id': todoId }
                ]
            }
        );

        const stage = updatedProject?.checklist?.find(s => s._id.toString() === stageId);
        const todo = stage?.todos?.find(t => t._id.toString() === todoId);

        return todo || null;
    },
    updateStage: async ({ projectId, stageId, input }: { projectId: string, stageId: string, input: IChecklistStageUpdateInput }): Promise<IChecklistStage | null> => {
        const update: any = {};
        Object.entries(input).forEach(([key, value]) => {
            if (key === 'title' && !value) {
                throw new ApolloError("Title can't be empty.", 'BAD_USER_INPUT');
            }
            
            if (value !== undefined) {
                update[`checklist.$[stage].${key}`] = value;
            }
        });

        if (Object.keys(update).length === 0) {
            throw new ApolloError('No values to update.', 'BAD_USER_INPUT');
        }

        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { $set: update },
            {
                new: true,
                arrayFilters: [
                    { 'stage._id': stageId },
                ]
            }
        );

        const stage = updatedProject?.checklist?.find(s => s._id.toString() === stageId);

        return stage || null;
    },
    deleteTodo: async({ projectId, stageId, todoId }: {projectId: string, stageId: string, todoId: string}): Promise<ICheckListTodoDelete> => {
        const result = await Project.findByIdAndUpdate(
            projectId,
            {
                $pull: {
                    'checklist.$[stage].todos': { _id: todoId }
                }
            },
            {
                new: true,
                arrayFilters: [
                    {'stage._id': stageId}
                ]
            }
        );
        if (!result) throw new ApolloError('Project not found.', 'NOT_FOUND');

        return {
            _id: todoId,
            stageId: stageId,
            success: true
        }
    },
    deleteStage: async({ projectId, stageId }: {projectId: string, stageId: string}): Promise<IDelete> => {
        const result = await Project.findByIdAndUpdate(
            projectId,
            {
                $pull: {
                    'checklist': { _id: stageId }
                }
            }
        );
        if (!result) throw new ApolloError('Project not found.', 'NOT_FOUND');

        return {
            _id: stageId,
            success: true
        }
    },
    createStage: async({ projectId, title }: {projectId: string, title: string}): Promise<IChecklistStage> => {
        const newStage = { title };
        const result = await Project.findByIdAndUpdate(
            projectId,
            {
                $push: {
                    'checklist': newStage
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
        if (!result) throw new ApolloError('Project not found.', 'NOT_FOUND');
        const createdStage = result.checklist[result.checklist.length - 1];

        return createdStage;
    },
    createTodo: async({ projectId, stageId, input }: {projectId: string, stageId: string, input: ICheckListTodoCreateInput}): Promise<IChecklistTodo> => {
        console.log(input);
        const project = await Project.findById(projectId);
        if (!project) throw new ApolloError('Project not found.', 'NOT_FOUND');
        const stage = project.checklist.id(stageId);
        if (!stage) throw new ApolloError('Stage not found.', 'NOT_FOUND');
        stage.todos.push(input);
        await project.save();
        const newTodo = stage.todos[stage.todos.length - 1];


        return newTodo;
    }
};