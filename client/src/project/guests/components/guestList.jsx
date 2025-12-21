import { Guest } from './guest';
import Button from '../../../components/ui/Button';
import { Fragment, useEffect, useState } from 'react';
import ChevronDown from '../../../assets/chevron-down.svg?react';
import { ADD_NEW_GUEST, GET_GUESTS } from '../graphql/guests';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useDebounce } from '../../../hooks/useDebounce';
import { dictionary } from '../../../utils/dictionary';

export function GuestList({ guestList }) {
	const [isOpen, setIsOpen] = useState(true);
	const [newGuestName, setNewGuestName] = useState('');
	const { id } = useParams();
	const debounceValue = useDebounce(newGuestName, 500);

	const [createGuest] = useMutation(ADD_NEW_GUEST, {
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
			<div className='bg-main px-2 py-4 text-bg font-bold flex gap-2 justify-between cursor-pointer' onClick={handleClick}>
				<p>
					{guestList.name} ({guestList.guests.length})
				</p>
				<ChevronDown className={`fill-bg w-6 h-6 ${isOpen ? 'rotate-180' : 'rotate-0'} transition-all duration-300`} />
			</div>
			<div className={`grid ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} transition-all duration-600`}>
				<div className={`flex flex-col overflow-hidden ${isOpen ? 'opacity-100' : 'opacity-0'} transition-all duration-600`}>
					{guestList.guests.map((guest) => (
						<Fragment key={guest._id}>
							<Guest guest={guest} />
							<hr />
						</Fragment>
					))}
					<div className='flex gap-2 p-2'>
						<input className='p-2 border-1 border-bg-dark rounded-md' placeholder={dictionary.add_guest_placeholder.PL} type='text' name='name' value={newGuestName} onChange={(e) => handleNewGuestNameChange(e.target.value)} />
						<Button onClick={handleAddGuest}>
							<p className='flex p-2'>{dictionary.add_guest.PL}</p>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
