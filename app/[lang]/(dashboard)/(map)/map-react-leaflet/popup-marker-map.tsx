"use client";
import { useState } from "react";
import Leaflet from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { websiteName } from "@/config/constants";
import { useTranslate } from "@/config/useTranslation";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { data } from "./viewIndex";
import { useParams } from "next/navigation";

// Create custom marker icons
const redIcon = new Leaflet.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new Leaflet.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = new Leaflet.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Leaflet.Icon.Default.imagePath = "../node_modules/leaflet"
Leaflet.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
});

interface MapState {
  lat: number;
  lng: number;
  zoom: number;
}

const PopupMarkerMap = ({ height = 350 }) => {
  const [state, setState] = useState<MapState>({
    lat: 24.717250305366306,
    lng: 46.679004766662196,
    zoom: 12,
  });
  const position: [number, number] = [state.lat, state.lng];
  const [titleDetails, setStateDetails] = useState("Details Location");
  const [openD, setOpenD] = useState(false);
  const { t } = useTranslate();
  const { lang } = useParams();

  const [markers, setMarkers] = useState([
    {
      id: 1,
      position: [24.717250305366306, 46.679004766662196],
      data: {
        CourtName: "Court 1",
        CourtCategory: "Family",
        Email: "abc@gmail.com",
        Location: "Saudi Arabia, Riyadh ",
      },
      icon: redIcon,
    },
    {
      id: 2,
      position: [24.726250305366306, 46.689004766662196],
      data: {
        CourtName: "Court 2",
        CourtCategory: "Criminal",
        Email: "abc@gmail.com",
        Location: "Saudi Arabia, Riyadh",
      },
      icon: blueIcon,
    },
    {
      id: 3,
      position: [24.737250305366306, 46.699004766662196],
      data: {
        CourtName: "Court 3",
        CourtCategory: "Civil",
        Email: "abc@gmail.com",
        Location: "Saudi Arabia, Riyadh",
      },
      icon: greenIcon,
    },
  ]);

  return (
    <>
      <MapContainer
        // center={position}
        // zoom={state.zoom}
        center={[state.lat, state.lng]}
        zoom={state.zoom}
        style={{ height: height }}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position} icon={marker.icon}>
            <Popup>
              <div
                className="contentMarker"
                dir={lang === "ar" ? "rtl" : "ltr"}
              >
                <div className="flex">
                  <span className="text-gray-900 text-sm font-small">
                    {t("Court Name")} :
                  </span>
                  <span>{t(marker.data.CourtName)}</span>
                </div>
                <div className="flex">
                  {" "}
                  <span className="text-gray-900 text-sm font-small">
                    {t("Court Category")} :
                  </span>
                  <span>{t(marker.data.CourtCategory)}</span>
                </div>
                <div className="flex">
                  {" "}
                  <span className="text-gray-900 text-sm font-small">
                    {t("Email")} :
                  </span>
                  <span>{t(marker.data.Email)}</span>
                </div>
                <div className="flex">
                  {" "}
                  <span className="text-gray-900 text-sm font-small">
                    {t("Location")} :
                  </span>
                  <span>{t(marker.data.Location)}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* <Marker position={position}>
                <Popup>
                    <div className="contentMarker">
                        <div>
                            <span className="text-gray-900 text-sm font-small">Store:</span>
                            <span>{row.STORE}</span>
                        </div>

                        <div>
                            <span className="text-gray-900 text-sm font-small">Name:</span>
                            <span>{row.Name}</span>
                        </div>
                        <ViewMore title={titleDetails} data={row}/>
                    </div>
                </Popup>
            </Marker> */}
      </MapContainer>
    </>
  );
};

export default PopupMarkerMap;
