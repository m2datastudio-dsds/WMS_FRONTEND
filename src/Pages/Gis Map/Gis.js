import React, { useRef, useState, useEffect } from "react";
import { GoogleMap, Polyline, OverlayView } from "@react-google-maps/api";
import Header from "../Header/Header";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WaterDamageIcon from "@mui/icons-material/WaterDamage";
import { Box, IconButton, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

// Utility to generate locations with both tag and displayName
const createTaggedLocation = (tag, name, lat, lng) => ({ tag, name, lat, lng });

const mainLocations = [
  { name: "RWPH (HeadWorks)", lat: 11.303439, lng: 76.896206, path: "/rwph" },
  createTaggedLocation("A1", "RTL-01", 11.294726, 76.912151),
  createTaggedLocation("A2", "RTL-02", 11.283777, 76.919915),
  createTaggedLocation("A3", "RTL-03", 11.274504, 76.908026),
  createTaggedLocation("A4", "RTL-04", 11.261091, 76.893633),
  createTaggedLocation("A5", "RTL-05", 11.233845, 76.899696),
  createTaggedLocation("A6", "RTL-06", 11.216927, 76.904616),
  { name: "CWPH/WTP", lat: 11.209835, lng: 76.90597, path: "/cwph" },
  createTaggedLocation("A7", "CTL-01", 11.19738, 76.912829),
  createTaggedLocation("A8", "CTL-02", 11.172162, 76.914954),
  createTaggedLocation("A9", "CTL-03", 11.145746, 76.918561),
  createTaggedLocation("A10", "CTL-04", 11.131346, 76.923421),
  createTaggedLocation("A11", "CTL-05", 11.106356, 76.920574),
  createTaggedLocation("A12", "CTL-06", 11.09898, 76.906337),
  { name: "MST-Pannimadai", lat: 11.098496, lng: 76.906302 }
];

// Branch locations
const branch0 = [
  { name: "MST-Pannimadai", lat: 11.098496, lng: 76.906302 },
  createTaggedLocation("A13", "FMB-01", 11.084632, 76.910684),
  createTaggedLocation("A14", "FMB-02", 11.072357, 76.931038),
  { name: "MBR 01 (Valarmathi Nagar)", lat: 11.072357, lng: 76.931042 },
  createTaggedLocation("A15", "FMB-03", 11.059894, 76.923552),
  createTaggedLocation("A16", "FMB-04", 11.02694, 76.933639),
  { name: "MBR 02 (Bharathi Park)", lat: 11.0210217, lng: 76.9467955 },
];

const branch1 = [
  { name: "MST-Pannimadai", lat: 11.098496, lng: 76.906302 },
  createTaggedLocation("A17", "FMB-05", 11.078134, 76.948517),
  createTaggedLocation("A18", "FMB-06", 11.075859, 76.951714),
  createTaggedLocation("A19", "FMB-07", 11.062088, 76.958427),
  createTaggedLocation("A20", "FMB-08", 11.049702, 76.965311),
  { name: "MSR - Ramakrishnapuram old", lat: 11.051611, lng: 76.993409 },
  { name: "MSR - Ramakrishnapuram new", lat: 11.054591, lng: 76.998006 },
];

const branch2 = [
  { name: "MST-Pannimadai", lat: 11.098496, lng: 76.906302 },
  createTaggedLocation("A21", "FMA-01", 11.085621, 76.907812),
  createTaggedLocation("A22", "FMA-02", 11.069282, 76.909545),
  createTaggedLocation("A23", "FMA-03", 11.045659, 76.895181),
  createTaggedLocation("A24", "FMA-04", 11.021029, 76.884553),
  createTaggedLocation("A25", "FMA-05", 11.001725, 76.89372),
  createTaggedLocation("A26", "FMA-06", 10.983211, 76.910107),
  createTaggedLocation("A27", "FMA-07", 10.969992, 76.930799),
  createTaggedLocation("A28", "FMA-08", 10.953905, 76.930054),
];

const branch3 = [
  createTaggedLocation("A28", "FMA-08", 10.953905, 76.930054),
  createTaggedLocation("A29", "FMA-09", 10.933991, 76.950233),
  createTaggedLocation("A30", "FMA-10", 10.931507, 76.957617),
  { name: "MBR 04 (Pilliyarpuram)", lat: 10.934861, lng: 76.964861 },
];

const branch4 = [
  createTaggedLocation("A28", "FMA-08", 10.953905, 76.930054),
  createTaggedLocation("A31", "FMA-11", 10.950468, 76.928688),
  createTaggedLocation("A32", "FMA-12", 10.942893, 76.924819),
  { name: "MBR 03 (Press Enclave)", lat: 10.940278, lng: 76.9225 },
];

const allLocations = [
  ...mainLocations,
  ...branch0.slice(1),
  ...branch1.slice(1),
  ...branch2.slice(1),
  ...branch3,
  ...branch4,
];

const path = (list) => list.map((loc) => ({ lat: loc.lat, lng: loc.lng }));
const paths = {
  main: path(mainLocations),
  b0: path(branch0),
  b1: path(branch1),
  b2: path(branch2),
  b3: path(branch3),
  b4: path(branch4),
};

const mbrMap = {
  "MBR 01 (Valarmathi Nagar)": "MBR_01",
  "MBR 02 (Bharathi Park)": "MBR_02",
  "MBR 03 (Press Enclave)": "MBR_03",
  "MBR 04 (Pilliyarpuram)": "MBR_04",
};

const msrMap = {
  "MSR - Ramakrishnapuram old": "MSR_01",
  "MSR - Ramakrishnapuram new": "MSR_02",
};

const mstMap = {
  "MST-Pannimadai": "MST_01"
};

const isTank = (name) => name.toLowerCase().includes("mbr") || name.toLowerCase().includes("msr") || name.toLowerCase().includes("mst");

const mssLabelUnitMap = {
  "Level Transmitter 1": "m",
  "Level Transmitter 2": "m",
  "Pressure Transmitter": "mH₂O",
  "Flow transmitter 1": "m³/hr",
  "Flow transmitter 2": "m³/hr",
  "Flow totaliser 1": "m³",
  "Flow totaliser 2": "m³",
  "Chlorine sensor": "mg/L",
  "Conductivity sensor": "µS/m",
  "PH": "",
  "Oxidation reduction potential": "",
};

const Gis = () => {
  const mapRef = useRef(null);
  const [popupData, setPopupData] = useState(null);
  const [mbrData, setMbrData] = useState({});
  const [msrData, setMsrData] = useState({});
  const [mstData, setMstData] = useState({}); // State for MST data
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch MBR Data
    fetch("http://65.2.129.140:5000/api/mbr-analog/latest")
      .then((res) => res.json())
      .then((res) => setMbrData(res.data || {}))
      .catch((err) => console.error("Failed to load MBR analog data", err));

    // Fetch MSR Data
    fetch("http://65.2.129.140:5000/api/msr-analog/latest")
      .then((res) => res.json())
      .then((res) => setMsrData(res.data || {}))
      .catch((err) => console.error("Failed to load MSR analog data", err));

    // Fetch MST Data
    fetch("http://65.2.129.140:5000/api/mst-analog/latest")
      .then((res) => res.json())
      .then((res) => setMstData(res.data || {}))
      .catch((err) => console.error("Failed to load MST analog data", err));
  }, []);

  const fitBounds = () => {
    if (mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();
      allLocations.forEach((loc) => bounds.extend({ lat: loc.lat, lng: loc.lng }));
      mapRef.current.fitBounds(bounds);
    }
  };

  const fetchValue = async (tag, lat, lng, displayName) => {
    const mbrKey = mbrMap[displayName];
    const msrKey = msrMap[displayName];
    const mstKey = mstMap[displayName]; // Fetch for MST data

    if (mbrKey && mbrData[mbrKey]) {
      setPopupData({
        name: displayName,
        lat,
        lng,
        ...mbrData[mbrKey],
      });
      return;
    }

    if (msrKey && msrData[msrKey]) {
      setPopupData({
        name: displayName,
        lat,
        lng,
        ...msrData[msrKey],
      });
      return;
    }

    if (mstKey && mstData[mstKey]) {
      setPopupData({
        name: displayName,
        lat,
        lng,
        ...mstData[mstKey], // Display MST data
      });
      return;
    }

    try {
      const res = await fetch(`http://65.2.129.140:5000/api/transmission/${tag}?_=${Date.now()}`);
      const data = await res.json();
      setPopupData({ name: displayName, lat, lng, ...data });
    } catch (err) {
      setPopupData({ name: displayName, lat, lng, date: "-", time: "-", value: "Error" });
    }
  };

  const renderMarker = (loc) => (
    <OverlayView
      key={loc.name + loc.lat}
      position={{ lat: loc.lat, lng: loc.lng }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <Box
        onClick={() => {
          if (loc.name.includes("RWPH")) return navigate("/rwph-table");
          if (loc.name.includes("CWPH")) return navigate("/cwph-table");
          if (loc.tag || mbrMap[loc.name] || msrMap[loc.name] || mstMap[loc.name]) fetchValue(loc.tag, loc.lat, loc.lng, loc.name);
        }}
        sx={{
          display: "flex",
          flexDirection: "column-reverse",
          alignItems: "center",
          transform: "translate(-50%, -50%)",
          cursor: "pointer",
        }}
      >
        <Box
          sx={{
            fontSize: "12px",
            padding: "2px 6px",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "#fff",
            borderRadius: "4px",
            marginBottom: "4px",
            whiteSpace: "nowrap",
            fontWeight: "bold",
          }}
        >
          {loc.name}
        </Box>
        {isTank(loc.name) ? (
          <WaterDamageIcon sx={{ fontSize: 32, color: "#cfb015" }} />
        ) : (
          <LocationOnIcon sx={{ fontSize: 32, color: "#2f3192" }} />
        )}
      </Box>
    </OverlayView>
  );

  return (
    <div>
      <Header />
      <GoogleMap
        mapContainerStyle={containerStyle}
        onLoad={(map) => {
          mapRef.current = map;
          fitBounds();
        }}
      >
        {allLocations.map(renderMarker)}
        {/* Updated Polyline colors for each path */}
        <Polyline path={paths.main} options={{ strokeColor: "#ee1d24", strokeWeight: 5 }} />
        <Polyline path={paths.b0} options={{ strokeColor: "#0094f7", strokeWeight: 5 }} />
        <Polyline path={paths.b1} options={{ strokeColor: "#0094f7", strokeWeight: 5 }} />
        <Polyline path={paths.b2} options={{ strokeColor: "#ee1d24", strokeWeight: 5 }} />
        <Polyline path={paths.b3} options={{ strokeColor: "#ee1d24", strokeWeight: 5 }} />
        <Polyline path={paths.b4} options={{ strokeColor: "#ee1d24", strokeWeight: 5 }} />

        {popupData && (
          <OverlayView
            position={{ lat: popupData.lat + 0.001, lng: popupData.lng + 0.001 }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <Paper
              elevation={6}
              sx={{
                p: 2,
                borderRadius: 3,
                backgroundColor: "#ffffff",
                minWidth: 260,
                maxWidth: 300,
                position: "relative",
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                fontFamily: `'Segoe UI', sans-serif`,
                transform: "translateY(-8px)",
              }}
            >
              <IconButton
                size="small"
                onClick={() => setPopupData(null)}
                sx={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  color: "#999",
                  "&:hover": { color: "#ee1d24" },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>

              <Box
                sx={{
                  color: "#ee1d24",
                  fontWeight: "700",
                  fontSize: "16px",
                  mb: 0.5,
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              >
                {popupData.name}
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13.5px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ color: "#2f3192" }}>Date:</strong>
                  <span>{popupData.date}</span>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ color: "#2f3192" }}>Time:</strong>
                  <span>{popupData.time}</span>
                </Box>

                {popupData?.sensors ? (
                  <>
                    <Box sx={{ fontWeight: 700, mb: 0.5, color: "#ee1d24", fontSize: "16px", textTransform: "uppercase" }}>Sensor Data:</Box>
                    {Object.entries(popupData.sensors).map(([sensorKey, value]) => {
                      const labelMap = {
                        ULT: "Level Transmitter",
                        PT: "Pressure Transmitter",
                        OCLR: "Chlorine Sensor",
                        OCND: "Conductivity Electrode",
                        FT: "Flow Transmitter",
                        FT_TT: "Flow Totaliser",
                      };

                      const type = sensorKey.includes("FT_TT") ? "FT_TT" : sensorKey.split(" ")[0];
                      const label = labelMap[type] || sensorKey;

                      const unitMap = {
                        ULT: "m",
                        PT: "mH₂O",
                        OCLR: "mg/L",
                        OCND: "µS/m",
                        FT: "m³/hr",
                        FT_TT: "m³",
                      };
                      const unit = unitMap[type] || mssLabelUnitMap[sensorKey] || "";

                      return (
                        <Box key={sensorKey} sx={{ display: "flex", justifyContent: "space-between" }}>
                          <strong style={{ color: "#2f3192" }}>{label}</strong>
                          <span style={{ color: "#2e7d32" }}>{value ?? "-"} {unit}</span>
                        </Box>
                      );
                    })}
                  </>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      color:
                        popupData.value === "Error" || popupData.value === "No data"
                          ? "#d32f2f"
                          : "#2e7d32",
                      fontWeight: 600,
                    }}
                  >
                    <strong style={{ color: "#2f3192" }}>Pressure Value:</strong>
                    <span>{popupData.value} mH₂O</span>
                  </Box>
                )}
              </Box>
            </Paper>
          </OverlayView>
        )}
      </GoogleMap>
    </div>
  );
};

export default Gis;
