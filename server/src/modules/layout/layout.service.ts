import Layout from './layout.model';
import User from '../auth/auth.model';
import { Types } from 'mongoose';
import { ApolloError } from 'apollo-server-errors';

interface LayoutPayload {
    name: string;
    components: {
        type: string;
        props: Record<string, any>;
        position: number;
    }[];
}

interface CreateInput {
    name: string;
    userId?: string;
}

export interface UpdateLayoutInput {
    id: string;
    layoutInput: {
        type: string;
        props: Record<string, any>;
        position: number;
    }[];
    userId?: string;
}

export const layoutServices = {
    createLayout: async ({name, userId}: CreateInput): Promise<LayoutPayload> => {
        if (!userId) {
            throw new ApolloError('User not authenticated.', 'USER_NOT_AUTHENTICATED');
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new ApolloError('User not found.', 'USER_NOT_FOUND');
        }

        if (user.layout && Types.ObjectId.isValid(user.layout)) {
            throw new ApolloError('Layout already exists for user.', 'LAYOUT_EXISTS');
        }

        const layout = await Layout.create({ name, ownerId: userId });
        user.layout = layout._id;

        await user.save();

        return { name: layout.name, components: layout.components};
    },

    updateLayout: async ({ id, layoutInput, userId }: UpdateLayoutInput): Promise<LayoutPayload> => {
        if (!userId) {
            throw new ApolloError('User not authenticated.', 'USER_NOT_AUTHENTICATED');
        }

        const layout = await Layout.findById(id);
        if (!layout) {
            throw new ApolloError('Layout not found.', 'LAYER_NOT_FOUND');
        }

        layout.set('components', layoutInput);
        await layout.save();
        return layout;
    }
}