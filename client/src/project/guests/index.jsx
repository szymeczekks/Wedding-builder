import { SectionHeader } from "../../components/ui/SectionHeader";
import BrideAndGroomImage from '../../assets/bride-and-groom.png';
import { useMutation, useQuery } from "@apollo/client/react";
import { ADD_NEW_GUEST_LIST, GET_GUESTS } from "./graphql/guests";
import { useParams } from "react-router-dom";
import { NotFound } from "../../404/404";
import { GuestList } from "./components/guestList";
import Button from "../../components/ui/Button";
import { dictionary } from "../../utils/dictionary";
import { useState } from "react";
import { gql } from "@apollo/client";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { useGuests } from "./hooks/useGuests";

export function Guests() {
    const { id } = useParams();
    const [ newGroupName, setNewGroupName ] = useState('');
    const { loading: isGuestsLoading, error, data } = useQuery(GET_GUESTS, {
        variables: { id },
        skip: !id
    });
    const allGuests = data?.getGuestLists.flatMap(gl => gl.guests);
    const { stats, availableSides } = useGuests(allGuests);



    const [createGuestList, {loading: isCreatingGuestList}] = useMutation(ADD_NEW_GUEST_LIST, {
        variables: {
            ProjectId: id,
            Name: newGroupName
        },
        update(cache, { data }) {
            if (!data?.createGuestList) return;
            cache.modify({
                fields: {
                    getGuestLists(existingRefs = []) {
                        const newRef = cache.writeFragment({
                            data: {
                                ...data.createGuestList,
                                guests: [],
                            },
                            fragment: gql`
                                fragment NewGuestList on GuestList {
                                    _id
                                    name
                                    guests
                                    __typename
                                }
                            `,
                        });

                        return [...existingRefs, newRef];
                    },
                },
            });
        }
    });

    const handleAddGroup = () => {
        createGuestList();
        setNewGroupName('');
    };

    if (isGuestsLoading) return null;
    if (error) return <NotFound/>;

    return <>
        <SectionHeader header="Lista gości" subheader="Przeglądaj, dodawaj i organizuj gości swojego wydarzenia." image={BrideAndGroomImage} />
        <div className="flex flex-col gap-3 mt-3">
            {data.getGuestLists.length === 0 && 'Nie masz jeszcze listy gości 😔'}
            {data.getGuestLists.map(guestList => <GuestList guestList={guestList} key={guestList._id} />)}
            <div className='flex gap-2'>
                <input className='p-2 border-1 border-bg-dark rounded-md' value={newGroupName} placeholder={dictionary.add_group_placeholder.PL} type='text' name='name' onChange={(e) => {setNewGroupName(e.target.value)}} />
                <Button onClick={handleAddGroup} isLoading={isCreatingGuestList}>
                    <p className=''>{dictionary.add_group.PL}</p>
                </Button>
            </div>
        </div>
        <div className="mt-10">
            <p className="text-center font-bold text-lg mb-5">{dictionary.guestsByType.PL}</p>
            <div className="flex gap-2 justify-center mb-5">
                {Object.keys(stats.guestsByType).length === 0 && '-'}
                {Object.keys(stats.guestsByType).map(g => <ProgressBar label={g} current={stats.guestsByType[g]} max={stats.allGuestsCount}/>)}
            </div>
            <p className="text-center font-bold text-lg mb-5">{dictionary.guestsBySide.PL}</p>
            <div className="flex gap-2 justify-center">
                {Object.keys(stats.guestsByType).length === 0 && '-'}
                {Object.keys(stats.guestsBySide).map(g => <ProgressBar label={availableSides.find(s => s.value === g).name} current={stats.guestsBySide[g]} max={stats.allGuestsCount}/>)}
            </div>
        </div>
    </>
}