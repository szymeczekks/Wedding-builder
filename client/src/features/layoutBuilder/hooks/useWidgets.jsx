import { useQuery } from "@apollo/client/react";
import { WIDGETS_QUERY } from '../graphql/getWidgets.js';
import { useLayoutStore } from "../store/useLayoutStore";

export const useWidgets = () => {
    const setWidgetsSchemas = useLayoutStore((state) => state.setWidgetsSchemas );
    const { data, loading, error } = useQuery(WIDGETS_QUERY);

    if (data && data.widgetSchemas) {
        setWidgetsSchemas(data.widgetSchemas);
    }

    return { data, loading, error };
};