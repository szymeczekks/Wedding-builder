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
import { UPDATE_RECEPTION } from "./graphql/reception";
import { useMutation, useQuery } from "@apollo/client/react";
import { useParams } from "react-router-dom";
import { GET_PROJECT } from "../shared/graphql/project";
import { useDebounce } from "../../hooks/useDebounce";
import { EditBox } from "../../components/ui/EditBox";

export function Reception() {
    const { id } = useParams();
    const { data } = useQuery(GET_PROJECT, {
        variables: { id },
        skip: !id
    });
    const receptionData = data.getProject.reception;

    const [activePicker, setActivePicker] = useState(null);
    const [receptionDate, setReceptionDate] = useState(receptionData.date);
    const [receptionLocation, setReceptionLocation] = useState(receptionData.location);
    const [receptionDescription, setReceptionDescription] = useState(receptionData.description);
    const [updatingField, setUpdatingField] = useState(null);
    const dayPickerAnchor = useRef(null);
    const debounceReceptionDescription = useDebounce(receptionDescription, 500);

    const [updateReception, { loading }] = useMutation(UPDATE_RECEPTION, {
        update(cache, { data }) {
            const updatedReception = data?.updateReception;
            if (!updatedReception) return;

            cache.modify({
                id: cache.identify({
                    __typename: 'Project',
                    _id: id,
                }),
                fields: {
                    reception() {
                        return updatedReception;
                    },
                },
            });
        }
    });

    useEffect(() => {
        if (receptionData.description === debounceReceptionDescription) return;
        updateReceptionField({ field: 'description', value: debounceReceptionDescription, onSuccess: () => { } })
    }, [debounceReceptionDescription]);

    const updateReceptionField = async ({ field, value, onSuccess }) => {
        setUpdatingField(field);
        setActivePicker(null);
        try {
            await updateReception({
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
        <SectionHeader header={dictionary.reception_header.PL} subheader={dictionary.reception_subheader.PL} image={BrideAndGroomImage} />
        <div className="mt-3 flex flex-col gap-3">
            <EditBox label={dictionary.reception_date_label.PL}>
                <PseudoLink handleClick={() => setActivePicker('date')} isLoading={loading && updatingField === 'date'} ref={dayPickerAnchor} >{receptionDate ? new Date(receptionDate).toLocaleDateString('pl-PL', {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }) : dictionary.reception_date_default.PL}</PseudoLink>
            </EditBox>
            <EditBox label={dictionary.reception_location_label.PL}>
                <PseudoLink handleClick={() => setActivePicker('location')} isLoading={loading && updatingField === 'location'}>{receptionLocation ? formatExactAddress(receptionLocation.address) : dictionary.reception_location_default.PL}</PseudoLink>
            </EditBox>
            <EditBox label={dictionary.reception_description_label.PL}>
                <textarea name="receptionDescription" id="receptionDescription" value={receptionDescription} className="text-xs md:text-base w-full rounded-md p-3 inset-shadow-sm inset-shadow-main-transparent bg-white" placeholder={dictionary.reception_description_default.PL} onChange={(e) => {
                    setReceptionDescription(e.target.value);
                }}></textarea>
            </EditBox>
        </div>

        {activePicker === 'date' && <AnchoredPortal anchorRef={dayPickerAnchor} onRequestClose={() => setActivePicker(null)}><CustomDayPicker
            date={receptionDate}
            onSelect={(value) => updateReceptionField({ field: 'date', value, onSuccess: (date) => setReceptionDate(date) })}
        /></AnchoredPortal>}
        {activePicker === 'location' && <FixedPortal onRequestClose={() => setActivePicker(null)}><Location
            defaultLocation={receptionLocation}
            onChange={(value) => updateReceptionField({ field: 'location', value, onSuccess: (location) => setReceptionLocation(location) })}
        /></FixedPortal>}
    </>
}