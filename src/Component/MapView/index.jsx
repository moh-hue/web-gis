import React, { useEffect, useState } from "react";
import { useRef } from "react";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import Search from "@arcgis/core/widgets/Search";
import * as query from "@arcgis/core/rest/query";
import LayerList from "@arcgis/core/widgets/LayerList";

//=========
// Template =====
const template = {
  // autocasts as new PopupTemplate()
  title: "Data ",
  content: [
    {
      type: "fields",
      fieldInfos: [
        {
          fieldName: "CITY_JUR",
        },
        {
          fieldName: "FEAT_CMNT	",
        },
        {
          fieldName: "PARK_NAME",
        },
        {
          fieldName: "TRL_NAME",
        },
      ],
    },
  ],
};

const ArcGISMapView = () => {
  const mapRef = useRef(null);
  const [view, setview] = useState(null);
  const [coordinates, setCoordinates] = useState({
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    if (!mapRef.current) return;
    // Initialize Map ============
    const map = new Map({
      basemap: "streets", // Basemap type
    });

    /// add feature layer ====
    const trailheadsLayer = new FeatureLayer({
      url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
      popupTemplate: template,
    });
    map.add(trailheadsLayer);

    // Initialize MapView =============
    const mapview = new MapView({
      container: mapRef.current,
      map: map,
      center: [-118.67569, 34.10896], // Starting position [Longitude, Latitude]
      zoom: 10,
    });

    // search===============
    const searchWidget = new Search({
      view: mapview,
    });
    mapview.ui.add(searchWidget, {
      position: "top-right",
    });
    // Event ======================
    mapview.on("click", (event) => {
      const { longitude, latitude } = event.mapPoint;

      // Update state with clicked coordinates
      setCoordinates({
        longitude: longitude.toFixed(5),
        latitude: latitude.toFixed(5),
      });

      // Clear existing graphics
      mapview.graphics.removeAll();

      // Add marker at clicked location
      const pointGraphic = new Graphic({
        geometry: event.mapPoint,
        symbol: {
          type: "simple-marker",
          color: "red",
          size: "12px",
        },
      });

      mapview.graphics.add(pointGraphic);
      //auto cast
      let queryParams = {
        distance: 1,
        units: "kilometers",
        geometry: event.mapPoint,
        outFields: ["*"],
        returnGeometry: true,
      };
      query
        .executeQueryJSON(
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/ArcGIS/rest/services/Trailheads/FeatureServer/0",
          queryParams
        )
        .then((res) => {
          console.log("query results", res);
          let features = res.features;
          features.forEach((feat) => {
            const featGraphic = new Graphic({
              geometry: feat.geometry,
              symbol: {},
            });
            mapview.graphics.add(featGraphic);
          });
        })
        .catch((err) => {
          console.log("query error messages", err);
        });
    });

    // layer list =======
    const layerList = new LayerList({
      view: mapview,
    });
    // Adds widget below other elements in the top left corner of the view
    mapview.ui.add(layerList, {
      position: "top-left",
    });

    // Cleanup on component unmount
    return () => {
      if (mapview) mapview.destroy();
    };
  }, []);

  return (
    <>
      <div ref={mapRef} style={{ height: "100vh", width: "100%" }}></div>
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          top: "590px",
          left: "15px",
          width: "170px",
          height: "50px",
          border: 0,
        }}>
        <strong>Longitude : </strong>
        {coordinates.longitude} <br />
        <strong>Latitude : </strong>
        {coordinates.latitude}
      </div>
    </>
  );
};

export default ArcGISMapView;
