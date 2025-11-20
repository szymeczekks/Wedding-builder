import { model, Schema } from "mongoose";

export interface IProject {
    name: string,
    creator?: string,
    sessionId?: string,
    config: Record<string, any>;
}

const ProjectSchema = new Schema({
    name: { type: String, required: true, default: 'Bez tytułu' },
    creator: { type: String, default: null },
    sessionId: { type: String, default: null },
    config: { type: Schema.Types.Mixed, required: true, default: {} }
}, {
    timestamps: true
});

export const Project = model('Project', ProjectSchema);