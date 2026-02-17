import { SectionHeader } from "../../components/ui/SectionHeader";
import { SummaryCouple } from "./components/SummaryCouple";
import BrideAndGroomImage from '../../assets/bride-and-groom.png';
import { SummaryCeremony } from "./components/SummaryCeremony";
import { dictionary } from "../../utils/dictionary";
import { SummaryReception } from "./components/SummaryReception";
import { ExpandableContent } from "../../components/ui/ExpandableContent";
import { useNavigate, useParams } from "react-router-dom";
import { SummaryChecklist } from "./components/SummaryChecklist";

const summaryItems = [
    {
        title: "Para młoda",
        component: SummaryCouple,
        editLink: 'guests'
    },
    {
        title: "Ceremonia",
        component: SummaryCeremony,
        editLink: 'ceremony'
    },
    {
        title: dictionary.reception.PL,
        component: SummaryReception,
        editLink: 'reception'
    },
    {
        title: dictionary.checklist.PL,
        component: SummaryChecklist,
        editLink: 'checklist'
    },
];

export function Summary() {
    let navigate = useNavigate();
    let { id } = useParams();

    return <>
        <SectionHeader header="Podsumowanie projektu" subheader="Przeglądaj najważniejsze informacje w jednym miejscu i monitoruj postęp przygotowań." image={BrideAndGroomImage} />
        <div className="flex flex-col gap-3 mt-3">
            {summaryItems.map(item => {
                const Component = item.component;
                return <ExpandableContent open={true} title={item.title} key={item.title} actions={[
                    {
                        name: dictionary.edit.PL,
                        action: () => navigate(`/project/${id}/${item.editLink}`)
                    }
                ]}>
                    <Component />
                </ExpandableContent>
            })}
        </div>
    </>
}