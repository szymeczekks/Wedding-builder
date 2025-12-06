import { SectionHeader } from "../../components/ui/SectionHeader";
import { SummaryCouple } from "./components/SummaryCouple";
import { SummaryItem } from "./components/SummaryItem";
import BrideAndGroomImage from '../../assets/bride-and-groom.png';

const summaryItems = [
    {
        title: "Para młoda",
        component: SummaryCouple
    },
];

export function Summary() {
    return <>
        <SectionHeader header="Podsumowanie projektu" subheader="Przeglądaj najważniejsze informacje w jednym miejscu i monitoruj postęp przygotowań." image={BrideAndGroomImage} />
        <div className="flex flex-col gap-3">
            <hr className="text-bg-dark"/>
            {summaryItems.map((item, index) => {
                const Component = item.component;
                return <>
                    <SummaryItem title={item.title} >
                        <Component />
                    </SummaryItem>
                </>
            })}
        </div>
    </>
}