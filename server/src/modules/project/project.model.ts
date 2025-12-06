import { model, Schema, Types } from "mongoose";

export interface IProject {
    _id: Types.ObjectId,
    name: string,
    creator?: string,
    sessionId?: string,
    brideName?: string | null,
    groomName?: string | null,
    config: Record<string, any>;
}

const ProjectSchema = new Schema({
    name: { type: String, required: true, default: 'Bez tytułu' },
    creator: { type: String, default: null },
    sessionId: { type: String, default: null },
    config: { type: Schema.Types.Mixed, default: () => ({}) },
}, {
    timestamps: true
});

export const Project = model('Project', ProjectSchema);