import { Schema, model } from 'mongoose';

export interface IWebsite {
    name: string,
    creator: string,
    sessionId: string,
    config: Record<string, any>;
}

const WebsiteSchema = new Schema({
    name: { type: String, required: true },
    creator: { type: String, required: true },
    sessionId: { type: String, required: true },
    config: { type: Schema.Types.Mixed, required: true, default: {} }
},
{
    timestamps: true
});

export const Website = model('Website', WebsiteSchema);