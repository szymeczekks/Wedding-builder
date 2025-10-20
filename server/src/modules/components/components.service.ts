import { ApolloError } from 'apollo-server-errors';
import { Component, IComponent } from './components.model';

interface createComponentInput {
    name: string;
    props: string[];
    userId?: string;
}

interface updateComponentInput {
    name: string;
    props: string[];
    id: string;
    userId?: string;
}

interface getComponentsInput {
    userId?: string;
}

interface deleteComponentInput {
    id: string;
    userId?: string;
}

interface IDeleteComponent {
    id: string;
    success: boolean;
}

export const componentsServices = {
    createComponent: async ({ name, props, userId }: createComponentInput): Promise<IComponent> => {
        if (!userId) throw new ApolloError('User not authenticated.', 'USER_NOT_AUTHENTICATED');
        if (props?.length === 0) throw new ApolloError('Props are not provided.', 'INPUT_ERROR');

        const newComponent = await Component.create({ name, props, userId });
        return newComponent;
    },

    getComponents: async ({ userId }: getComponentsInput): Promise<IComponent[]> => {
        if (!userId) throw new ApolloError('User not authenticated.', 'USER_NOT_AUTHENTICATED');
        const components = await Component.find()

        return components;
    },

    getComponentsByCreator: async ({ userId }: getComponentsInput): Promise<IComponent[]> => {
        if (!userId) throw new ApolloError('User not authenticated.', 'USER_NOT_AUTHENTICATED');
        const components = await Component.find({ userId: userId });
        return components;
    },

    updateComponent: async ({ name, props, id, userId }: updateComponentInput): Promise<IComponent> => {
        if (!userId) throw new ApolloError('User not authenticated.', 'USER_NOT_AUTHENTICATED');

        const component = await Component.findById(id);

        if (!component) throw new ApolloError('Component not found.', 'COMPONENT_NOT_FOUND');
        if (name !== undefined && name.trim() === '') throw new ApolloError('Invalid name: cannot be empty.', 'INVALID_VALUE');
        if (props !== undefined && props.some(p => !p || p.trim() === '')) throw new ApolloError('Invalid props: prop names cannot by empty strings.', 'INVALID_VALUE');

        if (name) component.name = name;
        if (props) component.props = props;
        await component.save();

        return component;
    },

    deleteComponent: async ({ id, userId }: deleteComponentInput): Promise<IDeleteComponent> => {
        let success = false;
        if (!userId) throw new ApolloError('User not authenticated.', 'USER_NOT_AUTHENTICATED');

        const component = await Component.findById(id);

        if (!component) throw new ApolloError('Component not found.', 'COMPONENT_NOT_FOUND');

        // await component.remove();
        success = true;
        return { id: component._id.toString(), success: success }
    }
}