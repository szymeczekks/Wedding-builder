import { useEffect, useState } from "react"
import { useDebounce } from "../../../hooks/useDebounce";
import { DELETE_GUEST, UPDATE_GUEST } from "../graphql/guests";
import { useMutation } from "@apollo/client/react";
import Ellipsis from '../../../assets/ellipsis-vertical.svg?react';
import ChevronDown from '../../../assets/chevron-down.svg?react';
import Trash from '../../../assets/trash.svg?react';
import Edit from '../../../assets/edit.svg?react';
import { dictionary } from "../../../utils/dictionary";
import { Loader } from "../../../components/ui/Loader";

const typesOfGuest = ['groom', 'bride', 'parent', 'sibling', 'family', 'friend'];

export function Guest({ guest }) {
    const [ name, setName ] = useState(guest.name);
    const [ guestType, setGuestType ] = useState(guest.type);
    const [ settingsActive, setSettingsActive ] = useState(false);
    const debounceName = useDebounce(name, 500);
    const debounceGuestType = useDebounce(guestType, 500);

    const [updateGuest, { loading }] = useMutation(UPDATE_GUEST, {
        variables: {
            Id: guest._id,
            UpdateInput: {
                name: debounceName,
                type: guestType
            },
        }
    });

    const [deleteGuest] = useMutation(DELETE_GUEST, {
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

    const handleOnChange = (newName) => {
        setName(newName);
    };

    useEffect(() => {
		if (debounceName !== guest.name || debounceGuestType !== guest.type) {
            updateGuest();
		}
	}, [debounceName, debounceGuestType]);

    return <div className="p-2 flex justify-between items-center gap-2 overflow-hidden relative">
        <div className="flex flex-col">
            <select name="type" id={`type-${guest._id}`} value={guest.type} className="text-sm w-fit" onChange={(e) => setGuestType(e.target.value)}>
                {typesOfGuest.map(type => <option key={type} value={type} >{dictionary[type].PL}</option>)}
            </select>
            <input className="py-2 w-full rounded-md hover:bg-white p-2" type="text" name="name" id={`name-${guest._id}`} value={name || ''} placeholder="Imię i nazwisko" onChange={(e) => handleOnChange(e.target.value)}/>
        </div>
        <div className="relative h-full">
            <button className="h-full rounded-md cursor-pointer p-2 group transition-all hover:bg-main" onClick={() => {
                setSettingsActive(prev => !prev);
            }}>
                <Ellipsis className={`fill-main w-6 h-6 transition-all group-[:hover]:fill-bg`} />
            </button>
            <div className={`absolute h-full right-0 top-0 bg-bg border-1 border-main rounded-md flex items-center overflow-hidden transition-all ${!settingsActive ? 'translate-x-[calc(100%+10px)]' : 'translate-x-0'}`}>
                <button className="bg-main h-full p-1 cursor-pointer" onClick={() => {
                    setSettingsActive(prev => !prev);
                }}>
                    <ChevronDown className='rotate-270 fill-bg w-6 h-6' />
                </button>
                <div className="p-1 flex gap-1">
                    <button className="bg-special rounded-md p-1 cursor-pointer h-10 w-10 flex items-center justify-center transition-all border-2 border-special group hover:bg-bg " onClick={deleteGuest}>
                        <Trash className='fill-bg w-6 h-6 group-[:hover]:fill-special' />
                    </button>
                    <button className="bg-main rounded-md p-1 cursor-pointer h-10 w-10 flex items-center justify-center transition-all border-2 border-main group hover:bg-bg">
                        <Edit className='fill-bg w-6 h-6 group-[:hover]:fill-main' />
                    </button>
                </div>
            </div>
        </div>
        {loading && <Loader/>}
    </div>
}