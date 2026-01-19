import { useEffect, useState } from "react"
import { useDebounce } from "../../../hooks/useDebounce";
import { DELETE_GUEST, GET_GUESTS, UPDATE_GUEST } from "../graphql/guests";
import { useMutation, useQuery } from "@apollo/client/react";
import Trash from '../../../assets/trash.svg?react';
import { dictionary } from "../../../utils/dictionary";
import { Loader } from "../../../components/ui/Loader";
import { useGuests } from "../hooks/useGuests";
import { useParams } from "react-router-dom";
import Button from "../../../components/ui/Button";

export function Guest({ guest }) {
    const { id } = useParams();
    const [ name, setName ] = useState(guest.name);
    const [ guestType, setGuestType ] = useState(guest.type);
    const [ guestSide, setGuestSide ] = useState(guest.side);
    const debounceName = useDebounce(name, 500);
    
    const { data } = useQuery(GET_GUESTS, {
        variables: { id },
        skip: !id
    });
    const allGuests = data?.getGuestLists.flatMap(gl => gl.guests);
    const { availableTypes, availableSides } = useGuests(allGuests);

    const [updateGuest, { loading }] = useMutation(UPDATE_GUEST, {
        variables: {
            Id: guest._id,
            UpdateInput: {
                name: debounceName,
                type: guestType,
                side: guestSide
            },
        }
    });

    const [deleteGuest, {loading: isGuestDeleting}] = useMutation(DELETE_GUEST, {
        variables: {
            Id: guest._id
        },
        update(cache) {
            cache.modify({
                id: cache.identify({
                    __typename: 'GuestList',
                    _id: guest.guestListId,
                }),
                fields: {
                    guests(existingGuests = [], { readField }) {
                        return existingGuests.filter(g => readField('_id', g) !== guest._id);
                    },
                },
            });
            cache.evict({
                id: cache.identify({
                    __typename: 'Guest',
                    _id: guest._id,
                }),
            });
            cache.gc();
        },
    });

    useEffect(() => {
		if (debounceName !== guest.name || guestType !== guest.type || guestSide !== guest.side) {
            updateGuest();
		}
	}, [debounceName, guestType, guestSide]);

    return <tr className="border-y-1 relative">
        <td className="p-2">
            <select name="type" id={`type-${guest._id}`} value={guest.type} className="text-sm w-fit max-w-full" onChange={(e) => setGuestType(e.target.value)}>
                {availableTypes[guest.type !== 'bride' && guest.type !== 'groom' ? 'rest' : 'newlyweds'].map(type => <option key={`${type}-${guest._id}`} value={type} >{dictionary[type].PL}</option>)}
            </select>
            <input className="py-2 w-full rounded-md hover:bg-white p-2" type="text" name="name" id={`name-${guest._id}`} value={name || ''} placeholder="Imię i nazwisko" onChange={(e) => setName(e.target.value)}/>
        </td>
        <td className="p-2">
            {guest.type !== 'bride' && guest.type !== 'groom' && <select name="side" id={`side-${guest.side}`} value={guest.side} className="text-sm w-fit max-w-full" onChange={(e) => setGuestSide(e.target.value)}>
                {availableSides.map(side => <option key={`${side.value}-${guest._id}`} value={side.value}>{side.name}</option>)}
            </select>}
        </td>
        <td className="p-2" align='center'>
            {guest.type !== 'bride' && guest.type !== 'groom' && <Button onClick={deleteGuest} isLoading={isGuestDeleting}><Trash className='fill-bg w-6 h-6 group-[:hover]:fill-special' /></Button>}
        </td>
        {loading && <Loader/>}
    </tr>
}