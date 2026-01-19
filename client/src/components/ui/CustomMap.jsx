import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { dictionary } from '../../utils/dictionary';

const ChangeView = ({ position }) => {
    const map = useMap();
    map.setView(position, 12);
    return null;
};

export function CustomMap({ position }) {
    return (
        <MapContainer
            center={position}
            zoom={13}
            style={{ height: '300px', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={position}>
                <Popup>
                    {dictionary.choosen_localization.PL}
                </Popup>
            </Marker>
            <ChangeView position={position} />
        </MapContainer>
    );
}