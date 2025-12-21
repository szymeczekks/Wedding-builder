import { SectionHeader } from "../../components/ui/SectionHeader";
import BrideAndGroomImage from '../../assets/bride-and-groom.png';
import { useQuery } from "@apollo/client/react";
import { GET_GUESTS } from "./graphql/guests";
import { useParams } from "react-router-dom";
import { NotFound } from "../../404/404";
import { GuestList } from "./components/guestList";
import Button from "../../components/ui/Button";
import { dictionary } from "../../utils/dictionary";

export function Guests() {
    const { id } = useParams();

    const { loading, error, data } = useQuery(GET_GUESTS, {
        variables: { id },
        skip: !id
    });

    if (loading) return null;
    if (error) return <NotFound/>;

    return <>
        <SectionHeader header="Lista gości" subheader="Przeglądaj, dodawaj i organizuj gości swojego wydarzenia." image={BrideAndGroomImage} />
        <div className="flex flex-col gap-3">
            <hr className="text-bg-dark"/>
            {data.getGuestLists.length === 0 && 'Nie masz jeszcze listy gości 😔'}
            {data.getGuestLists.map(guestList => <GuestList guestList={guestList} key={guestList._id} />)}
            <div className='flex gap-2'>
                <input className='p-2 border-1 border-bg-dark rounded-md' placeholder={dictionary.add_group_placeholder.PL} type='text' name='name'  />
                <Button>
                    <p className='flex p-2'>{dictionary.add_group.PL}</p>
                </Button>
            </div>
        </div>
    </>
}