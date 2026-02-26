"use client";
import { useMemo, useEffect, useState } from "react";
import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  InfoWindow,
} from "@react-google-maps/api";

const Maps = ({
  markers,
  setMarker,
  options,
  center,
  height = "500px",
  ...props
}) => {
  const [markersMap, setMarkersMap] = useState([]);
  const libraries = useMemo(() => ["places"], []);

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
      scrollwheel: true,
      draggable: true,
      zoomControl: true,
      minZoom: 10,
      maxZoom: 20,
      streetViewControl: false,
      ...options,
    }),
    [options],
  );

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_API_KEY,
    libraries: libraries,
  });

  useEffect(() => {
    setMarkersMap(markers);
  }, [markers]);

  const CustomMarker = ({ color, label, ...props }) => {
    const [isOpen, setIsOpen] = useState(false);
    let svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6" >
      <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" stroke="black"/>
    </svg>
    `;
    if (label === "Autobús") {
      svgString = `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 6v6" />
        <path d="M15 6v6" />
        <path d="M2 12h19.6" />
        <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
        <circle cx="7" cy="18" r="2" />
        <path d="M9 18h5" />
        <circle cx="16" cy="18" r="2" />
      </svg>`;
    }
    const svgColor = svgString?.replace("currentColor", color);
    const svgURL = URL.createObjectURL(
      new Blob([svgColor], { type: "image/svg+xml" }),
    );

    return (
      <div className="tooltip" data-tip={label}>
        <MarkerF
          icon={{
            url: svgURL,
            anchor: new window.google.maps.Point(15, 30),
            scaledSize: new window.google.maps.Size(30, 30),
          }}
          onClick={setIsOpen}
          {...props}
        />
        {isOpen && (
          <InfoWindow position={props.position} onCloseClick={setIsOpen}>
            <div className="p-4 bg-white border-2 border-yellow rounded-lg ">
              <h2>{label}</h2>
            </div>
          </InfoWindow>
        )}
      </div>
    );
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";

  return (
    <GoogleMap
      options={mapOptions}
      zoom={14}
      center={center ? center : markersMap[0]}
      mapContainerStyle={{ width: "100%", height: height }}
      {...props}
    >
      <>
        {markersMap.map((marker, index) => {
          return (
            <CustomMarker
              key={marker.studentId + index}
              position={{ lat: marker?.lat, lng: marker?.lng }}
              draggable={marker.draggable}
              onDragEnd={(e) => setMarker(marker.studentId, e.latLng.toJSON())}
              color={marker.color}
              label={marker.fullName || marker.name}
            />
          );
        })}
      </>
    </GoogleMap>
  );
};

export default Maps;
