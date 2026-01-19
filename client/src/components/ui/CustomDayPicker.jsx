import { useState } from "react";

import { DayPicker } from "react-day-picker";
import { pl } from "react-day-picker/locale";

export function CustomDayPicker({ onSelect, date }) {
    const [selected, setSelected] = useState(date);

    const handleSelected = (newSelected) => {
        if (!newSelected) return;
        setSelected(newSelected);
        onSelect(newSelected);
    }

    return (
        <DayPicker
            locale={pl}
            animate
            mode="single"
            selected={selected}
            onSelect={handleSelected}
            className="bg-white w-fit p-2 rounded-md"
            defaultMonth={selected}
            startMonth={selected}
            endMonth={new Date(3030, 9)}
            reverseYears={true}
            captionLayout="dropdown"
        />
    );
}