import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  Marker,
  Circle,
  InfoWindow,
} from "@react-google-maps/api";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
const libraries = ["places"];
const Google_Maps_Key = process.env.REACT_APP_Google_Maps_Key;
const mapContainerStyle = {
  width: "100%",
  height: "80vh",
};
const customMarkerIcon = (iconData) => {
  return {
    url:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
      <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13401 2 5 5.13401 5 9C5 13.87 12 22 12 22C12 22 19 13.87 19 9C19 5.13401 15.866 2 12 2ZM12 11.5C10.6193 11.5 9.5 10.3807 9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9C14.5 10.3807 13.3807 11.5 12 11.5Z" fill="#0f243d"/>
        <clipPath id="clipCircle">
          <circle cx="12" cy="9" r="6" />
        </clipPath>
        <image href="data:image/png;base64,${iconData}" x="0" y="0" width="20" height="20" clip-path="url(#clipCircle)" />
      </svg>
    `),
    scaledSize: {
      width: 80,
      height: 80,
    },
  };
};
const MAX = 100;
const MIN = 0;
const marks = [
  {
    value: MIN,
    label: "",
  },
  {
    value: MAX,
    label: "",
  },
];

const Maps = ({ Data2 }) => {
  //#region VARIABLE
  const { t, i18n } = useTranslation();
  const [val, setVal] = React.useState(100);
  const [initialCenter, setinitialCenter] = useState({
    lat: 24.7136,
    lng: 46.6753,
  });
  const [showMarker, setShowMarker] = useState(false);
  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [circleRadius, setCircleRadius] = useState(val * 1000);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const navigate = useNavigate();
  //#endregion VARIABLE
  //#region function
  const handleChange = (_, newValue) => {
    setVal(newValue);
    setCircleRadius(newValue * 1000);
  };
  const getDistance = (point1, point2) => {
    const lat1 = point1.lat;
    const lng1 = point1.lng;
    const lat2 = parseFloat(point2.latitude);
    const lng2 = parseFloat(point2.longitude);
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  };
  const filterLocations = (locations, center, radius) => {
    if (locations) {
      return locations.filter((location) => {
        const distance = getDistance(center, location);
        return distance <= radius;
      });
    }
  };
  const filteredLocations = filterLocations(Data2, initialCenter, circleRadius);
  const onLoad = (mapInstance) => {
    setMap(mapInstance);
  };
  const onUnmount = () => {
    // window.location.reload();
    localStorage.clear();
    localStorage.clear();
    setMap(null);
  };
  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        return;
      }
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setinitialCenter(location);
      setMarkers([location]);
      setSelectedMarker(null);

      if (map) {
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(place.geometry.location);
        map.fitBounds(bounds);

        const zoomChangeBoundsListener =
          window.google.maps.event.addListenerOnce(
            map,
            "bounds_changed",
            function (event) {
              if (this.getZoom() > 15) {
                this.setZoom(12);
              }
            }
          );

        setTimeout(() => {
          window.google.maps.event.removeListener(zoomChangeBoundsListener);
        }, 2000);
      }
    } else {
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMarker(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  const convert = (base64String) => {
    return `data:image/jpeg;base64,${base64String}`;
  };
  const GoToLocation = (longitude, latitude) => {
    if (
      longitude == "" ||
      latitude == "" ||
      latitude == null ||
      longitude == null
    ) {
      return;
    }
    const loc = {
      lat: parseFloat(latitude),
      lng: parseFloat(longitude),
    };

    setinitialCenter(loc);
    if (map) {
      map.panTo(loc);
      map.setZoom(15);
    }
  };
  const GoToAnalizer = (Imagesrc) => {
    navigate("/ImageTextExtractor", { state: { src: Imagesrc } });
  };
  const handleImageClick = (index, category, Url) => {
    if (category.split("/")[0] === "image") {
      navigate(`/image/${index}`);
    } else if (category.split("/")[0] === "video") {
      navigate("/Video", { state: { src: Url } });
    }
  };
  const GoToDocumentDetails = (Imagesrc) => {
    navigate("/DocumentDetails", { state: { src: Imagesrc } });
  };
  const GoToTextDetails = (Imagesrc) => {
    navigate("/TextDetails", { state: { src: Imagesrc } });
  };
  const convertToText = (base64String) => {
    try {
      let decodedString = atob(base64String);

      let utf8Decoder = new TextDecoder("utf-8");
      let utf8Array = new Uint8Array(
        [...decodedString].map((char) => char.charCodeAt(0))
      );
      let decodedText = utf8Decoder.decode(utf8Array);
      let splitteext = decodedText.split(".")[0];
      return splitteext;
    } catch (error) {
      console.error("Error decoding Base64:", error.message);
      return null;
    }
  };
  //#endregion VARIABLE

  return (
    <div className="row">
      <div className="col-md-2">
        <div
          className="row"
          style={{ overflowY: "scroll", maxHeight: "80vh", height: "auto" }}
        >
          <ImageList sx={{ width: 200 }} cols={1} >
            <ImageListItem
              key="Subheader"
              cols={1}
              style={{ height: "auto" }}
            ></ImageListItem>
            {filteredLocations?.map((item, index) => (
              <ImageListItem
                onClick={() => GoToLocation(item.longitude, item.latitude)}
                key={convert(item.thumbnails)}
                cols={1}
                style={{
                  height: "auto",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <img
                  className="image-map"
                  style={{ objectFit: "cover", width: "100%", height: "200px" }}
                  src={`${convert(item.thumbnails)}`}
                  alt={item.title}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={item.metadata_content_type.split("/")[0]}
                  subtitle={convertToText(item.metadata_storage_name)}
                  actionIcon={
                    <IconButton
                      style={{ color: "white" }}
                      aria-label={`info about ${item.title}`}
                      onClick={() => {
                        if (
                          item.metadata_content_type.split("/")[0] === "image"
                        ) {
                          GoToAnalizer(item);
                        } else if (
                          item.metadata_content_type.split("/")[0] === "video"
                        ) {
                          handleImageClick(
                            item.metadata_storage_name,
                            item.metadata_content_type,
                            item
                          );
                        } else if (
                          item.metadata_content_type.split("/")[0] ===
                          "application"
                        ) {
                          GoToDocumentDetails(item);
                        } else if (
                          item.metadata_content_type.split("/")[0] === "text"
                        ) {
                          GoToTextDetails(item);
                        }
                      }}
                    >
                      <InfoIcon />
                    </IconButton>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      </div>

      <div className="col-md-10">
        <LoadScript googleMapsApiKey={Google_Maps_Key} libraries={libraries}>
          <div style={{ position: "relative" }}>
            <Box
              sx={{
                position: "absolute",
                top: "40%",
                right: "0px",
                transform: "translateY(-50%)",
                zIndex: 10,
              }}
            >
              <Box sx={{ height: 200 }}>
                <Slider
                  marks={marks}
                  step={10}
                  value={val}
                  valueLabelDisplay="auto"
                  min={MIN}
                  max={MAX}
                  onChange={handleChange}
                  orientation="vertical"
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    onClick={() => setVal(MIN)}
                    sx={{ cursor: "pointer", marginBottom: 2 }}
                  >
                    {MIN} KM
                  </Typography>
                  <Typography
                    variant="body2"
                    onClick={() => setVal(MAX)}
                    sx={{ cursor: "pointer" }}
                  ></Typography>
                </Box>
              </Box>
            </Box>

            <Autocomplete
              onLoad={setAutocomplete}
              onPlaceChanged={onPlaceChanged}
            >
              <input
                type="text"
                placeholder={t("search_for_places")}
                className="search-input"
              />
            </Autocomplete>

            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={initialCenter}
              zoom={12}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              {showMarker &&
                filteredLocations?.map((marker, index) => (
                  <Marker
                    key={`marker-${marker.metadata_storage_name}-${marker.latitude}-${marker.longitude}`}
                    position={{
                      lat: parseFloat(marker.latitude),
                      lng: parseFloat(marker.longitude),
                    }}
                    icon={customMarkerIcon(marker.thumbnails)}
                    animation={window.google.maps.Animation.BOUNCE}
                    onClick={() =>
                      setSelectedMarker({
                        lat: parseFloat(marker.latitude),
                        lng: parseFloat(marker.longitude),
                      })
                    }
                  />
                ))}

              {showMarker && (
                <Circle
                  center={initialCenter}
                  radius={circleRadius}
                  options={{
                    fillColor: "rgba(0, 0, 255, 0.1)",
                    strokeColor: "rgba(0, 0, 255, 0.3)",
                    strokeWeight: 1,
                  }}
                />
              )}

              {selectedMarker && (
                <InfoWindow
                  position={selectedMarker}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <div>
                    <h2>Marker Details</h2>
                    {/* <h2>Marker Details{fetchLocationName(selectedMarker.lat,selectedMarker.lng)}</h2> */}
                    <p>Latitude: {selectedMarker.lat}</p>
                    <p>Longitude: {selectedMarker.lng}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
        </LoadScript>
      </div>
    </div>
  );
};

export default Maps;
