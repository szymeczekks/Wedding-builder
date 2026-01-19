import { model, Schema, Types } from "mongoose";
import { IGuest } from "../guest/guest.model";

export interface IProject {
    _id: Types.ObjectId,
    name: string,
    creator?: string,
    sessionId?: string,
    newlyweds?: IGuest[],
    config: Record<string, any>;
    ceremony: Record<string, any>;
};
export interface IProjectCeremony {
    _id: Types.ObjectId,
    date?: Date | null,
    location?: {
        provider: string;
        payload: unknown;
    },
    description?: string | null,
};
export interface IProjectCeremonyInput {
    date?: Date,
    location?: {
        provider: string;
        payload: unknown;
    },
    description?: string,
};

const CeremonySchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
        auto: false
    },
    date: Date,
    location: Schema.Types.Mixed,
    description: String
});

const ProjectSchema = new Schema({
    name: { type: String, required: true, default: 'Bez tytułu' },
    creator: { type: String, default: null },
    sessionId: { type: String, default: null },
    config: { type: Schema.Types.Mixed, default: () => ({}) },
    ceremony: { type: CeremonySchema, required: true },
    reception: { type: CeremonySchema, required: true },
}, {
    timestamps: true
});

export const Project = model('Project', ProjectSchema);