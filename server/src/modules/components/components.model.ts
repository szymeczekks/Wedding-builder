import { Schema, model } from "mongoose";

export interface IComponent {
    id?: string;
    name: string;
    props: string[];
    userId: string;
}

const ComponentSchema = new Schema({
    name: { type: String, required: true },
    props: [{ type: String, required: true }],
    userId: { type: String, required: true }
});

export const Component = model('Component', ComponentSchema);