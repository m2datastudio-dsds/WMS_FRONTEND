// src/Pages/Table/CWPHTABLE.js
import React from "react";
import "./CWPHTABLE.css";
import Header from "../Header/Header";
import { useCwphTabs, fmt } from "../../hooks/useCwphTabs";

/** Small helper: render raw values as ON/OFF or OPEN/CLOSE */
function ValueCell({ value, mode }) {
  let display;

  if (mode === "valve") {
    if (value === 0) display = "OPEN";
    else if (value === 1) display = "CLOSE";
    else display = "-";
  } else if (mode === "pump") {
    if (value === 0) display = "OFF";
    else if (value === 1) display = "ON";
    else display = "-";
  } else {
    display = fmt(value);
  }

  return (
    <th>
      <div className="rwph-val">{display}</div>
    </th>
  );
}

export default function CWPHTABLE() {
  const { v, loading, error, at } = useCwphTabs({ refreshMs: 10000 });

  return (
    <div className="page-wrapper">
      <Header />

      <div className="rwph-container">
        {/* status strip */}
        <div style={{ marginBottom: 8, fontSize: 12, opacity: 0.7 }}>
          {loading ? "Loading…" : error ? `Error: ${error.message}`
          : at
          ? `Data recorded at: ${new Date(at).toLocaleString()}`
          : "Data timestamp unavailable"
          }
        </div>

        {/* ===== Top Metrics ===== */}
        <table className="full-table">
          <thead>
            <tr>
              <th>pH</th>
              <th>Conductivity</th>
              <th>Oxidation Reduction Potential</th>
              <th>Free Chlorine</th>
              <th>Total Chlorine</th>
            </tr>
            <tr>
              <th>pH</th><th>µS/m</th><th>mV</th><th>mg/L</th><th>mg/L</th>
            </tr>
            <tr>
              <ValueCell value={v("TAB2", "A11")} />
              <ValueCell value={v("TAB2", "A12")} />
              <ValueCell value={v("TAB2", "A13")} />
              <ValueCell value={v("TAB2", "A14")} />
              <ValueCell value={v("TAB2", "A15")} />
            </tr>
          </thead>
        </table>

        {/* ===== Mid-row small blocks ===== */}
        <div className="mid-grid">
          <div className="cell">
            <table className="small-table">
              <thead>
                <tr><th>Pressure Transmitter 7</th></tr>
                <tr><th>mH2O</th></tr>
                <tr><ValueCell value={v("TAB2", "A8")} /></tr>
              </thead>
            </table>
          </div>

          <div className="cell">
            <table className="small-table">
              <thead>
                <tr><th>Valve 7</th></tr>
                <tr><ValueCell value={v("TAB1", "A13")} mode="valve" /></tr>
              </thead>
            </table>
          </div>

          <div className="cell">
            <table className="small-table">
              <thead>
                <tr><th>Valve Position 7</th></tr>
                <tr><th>%</th></tr>
                <tr><ValueCell value={v("TAB3", "A7")} /></tr>
              </thead>
            </table>
          </div>

          <div className="cell">
            <table className="small-table">
              <thead>
                <tr><th>Flow Transmitter 1</th></tr>
                <tr><th>m³/hr</th></tr>
                <tr><ValueCell value={v("TAB2", "A9")} /></tr>
              </thead>
            </table>
          </div>

          <div className="cell">
            <table className="small-table">
              <thead>
                <tr><th>Flow Totaliser 1</th></tr>
                <tr><th>m³</th></tr>
                <tr><ValueCell value={v("TAB2", "A10")} /></tr>
              </thead>
            </table>
          </div>
        </div>

        {/* ===== Valve Positions 1–6 ===== */}
        <table className="big-table">
          <thead>
            <tr>{[1, 2, 3, 4, 5, 6].map(n => <th key={n}>Valve Position {n}</th>)}</tr>
            <tr>{Array(6).fill("%").map((u, i) => <th key={i}>{u}</th>)}</tr>
            <tr>
              {["A1", "A2", "A3", "A4", "A5", "A6"].map(k => (
                <ValueCell key={k} value={v("TAB3", k)} />
              ))}
            </tr>
          </thead>
        </table>

        {/* ===== Valves 1–6 ===== */}
        <table className="big-table">
          <thead>
            <tr>{[1, 2, 3, 4, 5, 6].map(n => <th key={n}>Valve {n}</th>)}</tr>
            <tr>
              {["A7", "A8", "A9", "A10", "A11", "A12"].map(k => (
                <ValueCell key={k} value={v("TAB1", k)} mode="valve" />
              ))}
            </tr>
          </thead>
        </table>

        {/* ===== Pressure Transmitters 1–6 ===== */}
        <table className="big-table">
          <thead>
            <tr>{[1, 2, 3, 4, 5, 6].map(n => <th key={n}>Pressure Transmitter {n}</th>)}</tr>
            <tr>{Array(6).fill("mH2O").map((u, i) => <th key={i}>{u}</th>)}</tr>
            <tr>
              {["A2", "A3", "A4", "A5", "A6", "A7"].map(k => (
                <ValueCell key={k} value={v("TAB2", k)} />
              ))}
            </tr>
          </thead>
        </table>

        {/* ===== Cooling Line Water Pumps 1–6 ===== */}
        <table className="big-table">
          <thead>
            <tr>{[1, 2, 3, 4, 5, 6].map(n => <th key={n}> Pump {n}</th>)}</tr>
            <tr>
              {["A1", "A2", "A3", "A4", "A5", "A6"].map(k => (
                <ValueCell key={k} value={v("TAB1", k)} mode="pump" />
              ))}
            </tr>
          </thead>
        </table>

        {/* ===== Level Transmitter 1 ===== */}
        <div className="bottom-row">
          <table className="small-table">
            <thead>
              <tr><th>Level Transmitter 1</th></tr>
              <tr><th>m</th></tr>
              <tr><ValueCell value={v("TAB2", "A1")} /></tr>
            </thead>
          </table>
        </div>

      </div>
    </div>
  );
}
