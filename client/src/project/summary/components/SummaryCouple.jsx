import { Link, useParams } from "react-router-dom";
import Bride from '../../../assets/bride.png';
import Groom from '../../../assets/groom.png';
import Buttton from "../../../components/ui/Button";
import { useQuery } from "@apollo/client/react";
import { GET_PROJECT } from "../../shared/graphql/project";

export function SummaryCouple() {
    let { id } = useParams();

    const { data } = useQuery(GET_PROJECT, {
        variables: { id },
        skip: !id
    });

    return <div className="flex gap-6 justify-center">
        <div className="flex flex-col gap-4 items-center justify-between">
            {data.getProjectSummary.brideName ? 
                <p className="font-semibold text-lg">{data.getProjectSummary.brideName}</p> : 
                <Buttton>
                    <Link className="p-2">Ustaw imię panny młodej</Link>
                </Buttton>
            }
            <img src={Bride} alt="" className="max-h-full max-w-40 w-full" />
        </div>
        <div className="flex flex-col gap-4 items-center justify-between">
            {data.getProjectSummary.groomName ? 
                <p className="font-semibold text-lg">{data.getProjectSummary.groomName}</p> : 
                <Buttton>
                    <Link className="p-2">Ustaw imię pana młodego</Link>
                </Buttton>
            }
            
            <img src={Groom} alt="" className="max-h-full max-w-40 w-full" />
        </div>
    </div>
}