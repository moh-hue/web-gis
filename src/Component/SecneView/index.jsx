import React, { useEffect } from "react";
import { useRef } from "react";
import SceneView from "@arcgis/core/views/SceneView";
import Map from "@arcgis/core/Map";
const ArcSceneView = () => {
  const mapRef = useRef(null);
  useEffect(() => {
    const sceneview = new SceneView({
      map: new Map({
        basemap: "osm-3d",
      }),
      container: mapRef.current,
    });

    return () => sceneview && sceneview.destroy();
  }, []);

  return (
    <>
      <div ref={mapRef} style={{ height: "100vh", width: "100%" }}></div>
    </>
  );
};

export default ArcSceneView;
