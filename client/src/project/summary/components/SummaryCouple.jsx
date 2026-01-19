import { Link, useParams } from "react-router-dom";
import Bride from '../../../assets/bride.png';
import Groom from '../../../assets/groom.png';
import Buttton from "../../../components/ui/Button";
import { useQuery } from "@apollo/client/react";
import { GET_PROJECT } from "../../shared/graphql/project";
import { dictionary } from "../../../utils/dictionary";

export function SummaryCouple() {
    let { id } = useParams();

    const { data } = useQuery(GET_PROJECT, {
        variables: { id },
        skip: !id
    });

    return <div className="flex gap-6 justify-center">
        {data.getProject.newlyweds.map(partner => 
            <div className="flex flex-col gap-4 items-center justify-between">
                {partner.name ? 
                    <p className="font-semibold text-lg">{partner.name}</p> : 
                    <Buttton>
                        <Link className="p-2" to='../guests'>{dictionary[`set_name_${partner.type}`].PL}</Link>
                    </Buttton>
                }
                <img src={partner.type === 'bride' ? Bride : Groom } alt="" className="max-h-full max-w-40 w-full" />
            </div>
        )}
    </div>
}