"use client";
import { useMemo, useEffect, useState } from "react";
import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
// import map_pin.svg from public

const Maps = ({ markers, setMarker, options, ...props }) => {
  const [markersMap, setMarkersMap] = useState([]);
  const libraries = useMemo(() => ["places"], []);
  const mapCenter = useMemo(
    () =>
      markers[0]
        ? markers[0]
        : { lat: 19.432902439607627, lng: -99.13365305513578 },
    [markers],
  );
  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
      scrollwheel: true,
      draggable: true,
      zoomControl: true,
      minZoom: 13,
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
    // Aquí puedes manejar cambios en `markers`
    // Por ejemplo, podrías eliminar todos los marcadores antiguos y añadir los nuevos
    setMarkersMap(markers);
  }, [markers]);

  const CustomMarker = ({ color, label, ...props }) => {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6" >
      <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" stroke="black"/>
    </svg>
    `;
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
          {...props}
        />
      </div>
    );
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";

  return (
    <div className="bg-gray h-full ">
      <GoogleMap
        options={mapOptions}
        zoom={14}
        center={markersMap[0] ? markersMap[0] : mapCenter}
        mapContainerStyle={{ width: "100%", height: "500px" }}
        {...props}
      >
        <>
          {markersMap.map((marker, index) => {
            return (
              <CustomMarker
                key={marker.studentId + index}
                position={{ lat: marker?.lat, lng: marker?.lng }}
                draggable={marker.draggable}
                onDragEnd={(e) =>
                  setMarker(marker.studentId, e.latLng.toJSON())
                }
                color={marker.color}
                label={marker.name}
              />
            );
          })}
        </>
      </GoogleMap>
    </div>
  );
};

export default Maps;
