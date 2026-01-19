import { Guest } from './guest';
import Button from '../../../components/ui/Button';
import { Fragment, useEffect, useState } from 'react';
import ChevronDown from '../../../assets/chevron-down.svg?react';
import Trash from '../../../assets/trash.svg?react';
import { ADD_NEW_GUEST, DELETE_GUEST_LIST, GET_GUESTS } from '../graphql/guests';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useDebounce } from '../../../hooks/useDebounce';
import { dictionary } from '../../../utils/dictionary';

export function GuestList({ guestList }) {
	const [isOpen, setIsOpen] = useState(false);
	const [newGuestName, setNewGuestName] = useState('');
	const { id } = useParams();
	const debounceValue = useDebounce(newGuestName, 500);

	const [createGuest, {loading: isGuestAdding}] = useMutation(ADD_NEW_GUEST, {
		variables: {
			CreateGuestInput: {
				name: newGuestName,
				type: 'family',
				guestListId: guestList._id,
				projectId: id,
			},
		},
		update(cache, { data: { createGuest } }) {
			cache.modify({
				id: cache.identify({
					__typename: 'GuestList',
					_id: guestList._id,
				}),
				fields: {
					guests(existingGuests = []) {
						const newGuestRef = cache.writeFragment({
							data: createGuest,
							fragment: gql`
								fragment NewGuest on Guest {
									_id
									name
									type
									guestListId
								}
							`,
						});

						return [...existingGuests, newGuestRef];
					},
				},
			});
		},
	});

	const [deleteGuestList, {loading: isGuestListDeleting}] = useMutation(DELETE_GUEST_LIST, {
		variables: {
			Id: guestList._id
		},
		update(cache) {
			cache.modify({
				fields: {
					getGuestLists(existingGuestLists = [], { readField }) {
						return existingGuestLists.filter(g => readField('_id', g) !== guestList._id);
					},
				},
			});
			cache.evict({
				id: cache.identify({
					__typename: 'GuestList',
					_id: guestList._id,
				}),
			});
			cache.gc();
		},
	});

	const handleClick = () => {
		setIsOpen((prev) => !prev);
	};

	const handleAddGuest = () => {
		createGuest();
		setNewGuestName('');
	};

	const handleNewGuestNameChange = (newValue) => {
		setNewGuestName(newValue);
	};

	useEffect(() => {
		if (debounceValue) {
			console.log(debounceValue);
		}
	}, [debounceValue]);
	

	return (
		<div className='overflow-hidden rounded-md border-1 border-main'>
			<div className='bg-main p-2 text-bg font-bold flex justify-between items-center gap-2'>
				<div className='flex gap-2 cursor-pointer' onClick={handleClick}>
					<ChevronDown className={`fill-bg w-6 h-6 ${isOpen ? 'rotate-180' : 'rotate-0'} transition-all duration-300`} />
					<p>
						{guestList.name} ({guestList.guests.length})
					</p>
				</div>
				{guestList.type !== 'newlyweds' && 
				<Button onClick={deleteGuestList} isLoading={isGuestListDeleting}><Trash className='fill-main w-6 h-6 group-[:hover]:fill-special' /></Button>}
			</div>
			<div className={`grid ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} transition-all duration-400`}>
				<div className={`flex flex-col overflow-hidden ${isOpen ? 'opacity-100' : 'opacity-0'} transition-all duration-200`}>
					<table className={`table-fixed w-full ${guestList.type === 'newlyweds' && 'mb-[-1px]'}`}>
						<thead>
							<tr className='bg-main-transparent'>
								<th align='left' className='p-2 w-[50%]'>
									{dictionary.name_and_surname.PL}
								</th>
								<th align='left' className='p-2 w-[50%]'>
									{dictionary.side.PL}
								</th>
								<th align='center' className='p-2 whitespace-nowrap w-[100px]'>
									{dictionary.delete.PL}
								</th>
							</tr>
						</thead>
						<tbody>
							{guestList.guests.map((guest) => (
								<Guest key={guest._id} guest={guest} />
							))}
						</tbody>
					</table>
					{guestList.type !== 'newlyweds' && <div className='flex gap-2 p-2'>
						<input className='p-2 border-1 border-bg-dark rounded-md' placeholder={dictionary.add_guest_placeholder.PL} type='text' name='name' value={newGuestName} onChange={(e) => handleNewGuestNameChange(e.target.value)} />
						<Button onClick={handleAddGuest} isLoading={isGuestAdding}>
							<p>{dictionary.add_guest.PL}</p>
						</Button>
					</div>}
				</div>
			</div>
		</div>
	);
}
