import { SectionHeader } from "../../components/ui/SectionHeader";
import { SummaryCouple } from "./components/SummaryCouple";
import BrideAndGroomImage from '../../assets/bride-and-groom.png';
import { SummaryCeremony } from "./components/SummaryCeremony";
import { dictionary } from "../../utils/dictionary";
import { SummaryReception } from "./components/SummaryReception";
import Button from "../../components/ui/Button";
import { ExpandableContent } from "../../components/ui/ExpandableContent";
import { Link } from "react-router-dom";

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
];

export function Summary() {
    return <>
        <SectionHeader header="Podsumowanie projektu" subheader="Przeglądaj najważniejsze informacje w jednym miejscu i monitoruj postęp przygotowań." image={BrideAndGroomImage} />
        <div className="flex flex-col gap-3 mt-3">
            {summaryItems.map(item => {
                const Component = item.component;
                return <ExpandableContent title={item.title} key={item.title} actions={<Button><Link className="p-2" to={`../${item.editLink}`}>Edytuj</Link></Button>}>
                    <Component />
                </ExpandableContent>
            })}
        </div>
    </>
}