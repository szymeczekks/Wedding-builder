import { useState } from "react";
import Button from "../../../components/ui/Button";
import { CustomMap } from "../../../components/ui/CustomMap";
import { dictionary } from "../../../utils/dictionary";
import { formatExactAddress } from "../../../utils/location";

export function Location({ onChange, defaultLocation }) {
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);

    const geocodeCity = async (query) => {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                query
            )}&limit=1&addressdetails=1`
        );

        if (!response.ok) {
            throw new Error('Błąd geokodowania');
        }

        const data = await response.json();

        if (!data.length) {
            return null;
        }

        return {
            lat: Number(data[0].lat),
            lon: Number(data[0].lon),
            displayName: data[0].display_name,
            address: data[0].address,
        };
    };


    const handleSearch = async () => {
        setError(null);
        setSearchLoading(true);

        if (!query.trim()) return;

        const result = await geocodeCity(query);

        if (!result) {
            setError('Nie znaleziono lokalizacji');
            return;
        }
        setSearchLoading(false);
        setLocation({
            position: [result.lat, result.lon],
            address: result.address
        });
    };

    return <div className="md:min-w-xl w-full">
        <label htmlFor="searchLocation" className="text-sm md:text-base mb-2 block font-main color-main">{dictionary.search_location_label.PL}</label>
        <div className='flex gap-2 mb-4'>
            <input id="searchLocation" className='text-sm md:text-base p-2 border-1 border-bg-dark rounded-md flex-1 w-full' value={query} placeholder={dictionary.search_location_placeholder.PL} type='text' name='searchLocation' onChange={(e) => { setQuery(e.target.value) }} />
            <Button isLoading={searchLoading} onClick={handleSearch}>
                <p>{dictionary.search_location.PL}</p>
            </Button>
        </div>
        {defaultLocation?.address && <div className=" text-sm md:text-base rounded-md p-2 flex justify-between gap-2 items-center font-main mb-4 bg-bg border-2 border-special">
            <p className="font-semibold">{formatExactAddress(defaultLocation.address)}</p>
            {/* <Button onClick={() => {}}><p>{dictionary.change.PL}</p></Button> */}
        </div>}
        {location?.address && <div className=" text-sm md:text-base rounded-md p-2 flex justify-between gap-2 items-center font-main mb-4 bg-bg">
            <p>{formatExactAddress(location.address)}</p>
            <Button onClick={() => onChange(location)}><p>{dictionary.choose.PL}</p></Button>
        </div>}
        <CustomMap position={location?.position ?? defaultLocation?.position ?? [52.2297, 21.0122]} />
    </div>
}