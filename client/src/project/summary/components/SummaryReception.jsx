import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_PROJECT } from "../../shared/graphql/project";
import { dictionary } from "../../../utils/dictionary";
import { PseudoLink } from "../../../components/ui/PseudoLink";
import { formatExactAddress } from "../../../utils/location";
import { UPDATE_RECEPTION } from "../../reception/graphql/reception";
import { AnchoredPortal } from "../../../components/portals/AnchoredPortal";
import { FixedPortal } from "../../../components/portals/FixedPortal";
import { CustomDayPicker } from "../../../components/ui/CustomDayPicker";
import { Location } from "../../reception/components/Location";
import { useState, useRef  } from "react";
import { EditBox } from "../../../components/ui/EditBox";

export function SummaryReception() {
    let { id } = useParams();
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
    const { data } = useQuery(GET_PROJECT, {
        variables: { id },
        skip: !id
    });
    const receptionData = data.getProject.reception;
    const [activePicker, setActivePicker] = useState(null);
    const [receptionDate, setReceptionDate] = useState(receptionData.date);
    const [receptionLocation, setReceptionLocation] = useState(receptionData.location);
    const [updatingField, setUpdatingField] = useState(null);
    const dayPickerAnchor = useRef(null);

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

    return <div className="flex gap-2 justify-center flex-col md:flex-row">
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
        {activePicker === 'date' && <AnchoredPortal anchorRef={dayPickerAnchor} onRequestClose={() => setActivePicker(null)}><CustomDayPicker
            date={receptionDate}
            onSelect={(value) => updateReceptionField({ field: 'date', value, onSuccess: (date) => setReceptionDate(date) })}
        /></AnchoredPortal>}
        {activePicker === 'location' && <FixedPortal onRequestClose={() => setActivePicker(null)}><Location
            defaultLocation={receptionLocation}
            onChange={(value) => updateReceptionField({ field: 'location', value, onSuccess: (location) => setReceptionLocation(location) })}
        /></FixedPortal>}
    </div>
}