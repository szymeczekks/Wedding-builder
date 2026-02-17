import { SectionHeader } from "../../components/ui/SectionHeader";
import BrideAndGroomImage from '../../assets/bride-and-groom.png';
import { dictionary } from "../../utils/dictionary";
import { PseudoLink } from "../../components/ui/PseudoLink";
import { CustomDayPicker } from "../../components/ui/CustomDayPicker";
import { useEffect, useRef, useState } from "react";
import { AnchoredPortal } from "../../components/portals/AnchoredPortal";
import { FixedPortal } from "../../components/portals/FixedPortal";
import { Location } from "./components/Location";
import { formatExactAddress } from "../../utils/location";
import { UPDATE_CEREMONY } from "./graphql/ceremony";
import { useMutation, useQuery } from "@apollo/client/react";
import { useParams } from "react-router-dom";
import { GET_PROJECT } from "../shared/graphql/project";
import { useDebounce } from "../../hooks/useDebounce";
import { EditBox } from "../../components/ui/EditBox";

export function Ceremony() {
    const { id } = useParams();
    const { data } = useQuery(GET_PROJECT, {
        variables: { id },
        skip: !id
    });
    const ceremonyData = data.getProject.ceremony;

    const [activePicker, setActivePicker] = useState(null);
    const [ceremonyDate, setCeremonyDate] = useState(ceremonyData.date);
    const [ceremonyLocation, setCeremonyLocation] = useState(ceremonyData.location);
    const [ceremonyDescription, setCeremonyDescription] = useState(ceremonyData.description);
    const [updatingField, setUpdatingField] = useState(null);
    const dayPickerAnchor = useRef(null);
    const debounceCeremonyDescription = useDebounce(ceremonyDescription, 500);

    const [updateCeremony, { loading }] = useMutation(UPDATE_CEREMONY, {
        update(cache, { data }) {
            const updatedCeremony = data?.updateCeremony;
            if (!updatedCeremony) return;

            cache.modify({
                id: cache.identify({
                    __typename: 'Project',
                    _id: id,
                }),
                fields: {
                    ceremony() {
                        return updatedCeremony;
                    },
                },
            });
        }
    });

    useEffect(() => {
        if (ceremonyData.description === debounceCeremonyDescription) return;
        updateCeremonyField({ field: 'description', value: debounceCeremonyDescription, onSuccess: () => { } })
    }, [debounceCeremonyDescription]);

    const updateCeremonyField = async ({ field, value, onSuccess }) => {
        setUpdatingField(field);
        setActivePicker(null);
        try {
            await updateCeremony({
                variables: {
                    ProjectId: id,
                    Input: {
                        [field]: value,
                    },
                }
            });
            onSuccess(value);
        } finally {
            setUpdatingField(null);
        }
    }

    return <>
        <SectionHeader header={dictionary.ceremony_header.PL} subheader={dictionary.ceremony_subheader.PL} image={BrideAndGroomImage} />
        <div className="mt-3 flex flex-col gap-3">
            <EditBox label={dictionary.ceremony_date_label.PL}>
                <PseudoLink handleClick={() => setActivePicker('date')} isLoading={loading && updatingField === 'date'} ref={dayPickerAnchor} >{ceremonyDate ? new Date(ceremonyDate).toLocaleDateString('pl-PL', {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }) : dictionary.ceremony_date_default.PL}</PseudoLink>
            </EditBox>
            <EditBox label={dictionary.ceremony_location_label.PL}>
                <PseudoLink handleClick={() => setActivePicker('location')} isLoading={loading && updatingField === 'location'}>{ceremonyLocation ? formatExactAddress(ceremonyLocation.address) : dictionary.ceremony_location_default.PL}</PseudoLink>
            </EditBox>
            <EditBox label={dictionary.ceremony_description_label.PL}>
                <textarea name="ceremonyDescription" id="ceremonyDescription" value={ceremonyDescription} className="text-xs md:text-base w-full rounded-md p-3 inset-shadow-sm inset-shadow-main-transparent bg-white" placeholder={dictionary.ceremony_description_default.PL} onChange={(e) => {
                    setCeremonyDescription(e.target.value);
                }}></textarea>
            </EditBox>
        </div>

        {activePicker === 'date' && <AnchoredPortal anchorRef={dayPickerAnchor} onRequestClose={() => setActivePicker(null)}><CustomDayPicker
            date={ceremonyDate}
            onSelect={(value) => updateCeremonyField({ field: 'date', value, onSuccess: (date) => setCeremonyDate(date) })}
        /></AnchoredPortal>}
        {activePicker === 'location' && <FixedPortal onRequestClose={() => setActivePicker(null)}><Location
            defaultLocation={ceremonyLocation}
            onChange={(value) => updateCeremonyField({ field: 'location', value, onSuccess: (location) => setCeremonyLocation(location) })}
        /></FixedPortal>}
    </>
}