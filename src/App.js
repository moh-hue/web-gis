import React, { useState } from "react";
import ArcGISMapView from "./Component/MapView";
import ArcSceneView from "./Component/SecneView";
function App() {
  const [mapView, setmapView] = useState(true);
  const [sceneView, setsceneView] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          setmapView(true);
          setsceneView(false);
        }}
        className=""
        style={{
          background: "#242424",
          color: "white",
          position: "absolute",
          zIndex: 1,
          top: "200px",
          left: "15px",
          width: "32px",
          height: "32px",
          border: 0,
        }}>
        2D
      </button>
      <button
        onClick={() => {
          setmapView(false);
          setsceneView(true);
        }}
        className=""
        style={{
          background: "#242424",
          color: "white",
          position: "absolute",
          zIndex: 1,
          top: "235px",
          left: "15px",
          width: "32px",
          height: "32px",
          border: 0,
        }}>
        3D
      </button>
      {mapView ? <ArcGISMapView /> : <ArcSceneView />}
    </>
  );
}
export default App;
