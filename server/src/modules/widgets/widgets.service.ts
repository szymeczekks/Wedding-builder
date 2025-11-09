import { Widget, IWidgetSchema } from "./widgets.model";
import { ApolloError } from 'apollo-server-errors';
import validator from 'validator';

export const widgetsService = {
    widgetSchemas: async ():Promise<IWidgetSchema[]> => {
        let widgets = await Widget.find().lean<IWidgetSchema[]>();
        return widgets;
    },
    widgetSchema: async ({ type }: { type: string}):Promise<IWidgetSchema> => {
        let widget = await Widget.find({ type }).lean<IWidgetSchema>();
        return widget;
    }
}