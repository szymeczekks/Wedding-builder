import { widgetsService } from './widgets.service';

export const widgetResolvers = {
    Query: {
        widgetSchemas: async () => {
            return widgetsService.widgetSchemas();
        },
        widgetSchema: async (_:any, { type }: {type: string}) => {
            return widgetsService.widgetSchema({ type });
        }
    }
}