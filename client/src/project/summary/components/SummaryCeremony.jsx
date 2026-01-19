import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_PROJECT } from "../../shared/graphql/project";
import { dictionary } from "../../../utils/dictionary";
import { PseudoLink } from "../../../components/ui/PseudoLink";
import { formatExactAddress } from "../../../utils/location";
import { UPDATE_CEREMONY } from "../../ceremony/graphql/ceremony";
import { AnchoredPortal } from "../../../components/portals/AnchoredPortal";
import { FixedPortal } from "../../../components/portals/FixedPortal";
import { CustomDayPicker } from "../../../components/ui/CustomDayPicker";
import { Location } from "../../ceremony/components/Location";
import { useState, useRef  } from "react";
import { EditBox } from "../../../components/ui/EditBox";

export function SummaryCeremony() {
    let { id } = useParams();
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
    const { data } = useQuery(GET_PROJECT, {
        variables: { id },
        skip: !id
    });
    const ceremonyData = data.getProject.ceremony;
    const [activePicker, setActivePicker] = useState(null);
    const [ceremonyDate, setCeremonyDate] = useState(ceremonyData.date);
    const [ceremonyLocation, setCeremonyLocation] = useState(ceremonyData.location);
    const [updatingField, setUpdatingField] = useState(null);
    const dayPickerAnchor = useRef(null);

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

    return <div className="flex gap-2 justify-center flex-col md:flex-row">
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
        {activePicker === 'date' && <AnchoredPortal anchorRef={dayPickerAnchor} onRequestClose={() => setActivePicker(null)}><CustomDayPicker
            date={ceremonyDate}
            onSelect={(value) => updateCeremonyField({ field: 'date', value, onSuccess: (date) => setCeremonyDate(date) })}
        /></AnchoredPortal>}
        {activePicker === 'location' && <FixedPortal onRequestClose={() => setActivePicker(null)}><Location
            defaultLocation={ceremonyLocation}
            onChange={(value) => updateCeremonyField({ field: 'location', value, onSuccess: (location) => setCeremonyLocation(location) })}
        /></FixedPortal>}
    </div>
}