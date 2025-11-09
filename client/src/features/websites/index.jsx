import { useQuery } from "@apollo/client/react";
import { WEBSITES_QUERY } from "./graphql/getWebsites";
import Website from "./components/Website";
import Buttton from "../../components/ui/Button";

export default function WebsitesPage () {
    const { data, loading, error } = useQuery(WEBSITES_QUERY);

    if (loading) return <div>Loading pages...</div>;
    if (error) return <div>Error while fetching pages...</div>;
    console.log(data.getWebsites);
    return <div>
        {data.getWebsites.length > 0 ? 
        <ul>
            {data.getWebsites.map(website => <li key={website._id}><Website name={website.name} id={website._id}/></li>)}
        </ul> : <Buttton>Dodaj swoją pierwszą stronę</Buttton>}
    </div>;
}