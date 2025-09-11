import React from "react";
import "./RWPHTABLE.css";
import Header from "../Header/Header";
import { useRwphTabs, fmt } from "../../hooks/useRwphTabs";

/** Helper: format values depending on mode (pump/valve) */
function ValueCell({ value, mode }) {
  const isNil = value === null || value === undefined;
  const n = isNil ? NaN : Number(value);

  let display = isNil ? "-" : fmt(value);
  let extraClass = "";

  if (mode === "pump") {
    if (!Number.isNaN(n)) {
      if (n === 0) { display = "OFF"; extraClass = "off"; }
      else if (n === 1) { display = "ON"; extraClass = "on"; }
      else { display = "-"; }
    } else {
      display = "-";
    }
  }

  if (mode === "valve") {
    if (!Number.isNaN(n)) {
      if (n === 0) { display = "CLOSE"; extraClass = "close"; }
      else if (n === 1) { display = "OPEN";  extraClass = "open"; }
      else { display = "-"; }
    } else {
      display = "-";
    }
  }

  return (
    <th>
      <div className={`rwph-val ${extraClass}`}>{display}</div>
    </th>
  );
}

export default function RWPHTABLE() {
  const { v, loading, error } = useRwphTabs({ refreshMs: 10000 });

  return (
    <div className="page-wrapper">
      <Header />
      <div className="rwph-container">
        {/* status (optional) */}
        <div style={{ marginBottom: 8, fontSize: 12, opacity: 0.7 }}>
          {loading ? "Loading…" : error ? `Error: ${error.message}` : "Live"}
        </div>

        {/* ===== Cooling Line Water Pump row ===== */}
        <div className="row center">
          <div className="spacer" /><div className="spacer" />

          <table className="small-table">
            <thead>
              <tr><th>Cooling Line Water Pump 1</th></tr>
              <tr><ValueCell value={v("TAB1", "A7")} mode="pump" /></tr>
            </thead>
          </table>

          <table className="small-table">
            <thead>
              <tr><th>Cooling Line Water Pump 2</th></tr>
              <tr><ValueCell value={v("TAB1", "A8")} mode="pump" /></tr>
            </thead>
          </table>

          <div className="spacer" /><div className="spacer" />
        </div>

        {/* ===== Top Metrics (5 columns) ===== */}
        <table className="full-table">
          <thead>
            <tr>
              <th>pH</th>
              <th>Conductivity</th>
              <th>Oxidation Reduction Potential</th>
              <th>Free chlorine</th>
              <th>Total chlorine</th>
            </tr>
            <tr>
              <th>pH</th><th>µS/m</th><th>mV</th><th>mg/L</th><th>mg/L</th>
            </tr>
            <tr>
              <ValueCell value={v("TAB2", "A30")} />
              <ValueCell value={v("TAB2", "A31")} />
              <ValueCell value={v("TAB2", "A32")} />
              <ValueCell value={v("TAB2", "A33")} />
              <ValueCell value={v("TAB2", "A34")} />
            </tr>
          </thead>
        </table>

        {/* ===== Mid-row layout ===== */}
        <div className="mid-grid">
          <div className="cell">
            <table className="small-table">
              <thead>
                <tr><th>Pressure Transmitter 13</th></tr>
                <tr><th>mH2O</th></tr>
                <tr><ValueCell value={v("TAB2", "A15")} /></tr>
              </thead>
            </table>
          </div>

          <div className="cell">
            <table className="small-table">
              <thead>
                <tr><th>Valve 7</th></tr>
                <tr><ValueCell value={v("TAB1", "A15")} mode="valve" /></tr>
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
                <tr><th>m3/hr</th></tr>
                <tr><ValueCell value={v("TAB2", "A16")} /></tr>
              </thead>
            </table>
          </div>

          <div className="cell">
            <table className="small-table">
              <thead>
                <tr><th>Flow Totaliser 1</th></tr>
                <tr><th>m3</th></tr>
                <tr><ValueCell value={v("TAB2", "A23")} /></tr>
              </thead>
            </table>
          </div>
        </div>

        {/* ===== Valve Position 1–6 ===== */}
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

        {/* ===== Valve 1–6 (OPEN/CLOSE from TAB1 A9–A14) ===== */}
        <table className="big-table">
          <thead>
            <tr>{[1, 2, 3, 4, 5, 6].map(n => <th key={n}>Valve {n}</th>)}</tr>
            <tr>
              {["A9", "A10", "A11", "A12", "A13", "A14"].map(k => (
                <ValueCell key={k} value={v("TAB1", k)} mode="valve" />
              ))}
            </tr>
          </thead>
        </table>

        {/* ===== Flow Totaliser 2–7 ===== */}
        <table className="big-table">
          <thead>
            <tr>{[2, 3, 4, 5, 6, 7].map(n => <th key={n}>Flow Totaliser {n}</th>)}</tr>
            <tr>{Array(6).fill("m3").map((u, i) => <th key={i}>{u}</th>)}</tr>
            <tr>
              {["A24", "A25", "A26", "A27", "A28", "A29"].map(k => (
                <ValueCell key={k} value={v("TAB2", k)} />
              ))}
            </tr>
          </thead>
        </table>

        {/* ===== Flow Transmitter 2–7 ===== */}
        <table className="big-table">
          <thead>
            <tr>{[2, 3, 4, 5, 6, 7].map(n => <th key={n}>Flow Transmitter {n}</th>)}</tr>
            <tr>{Array(6).fill("LPM").map((u, i) => <th key={i}>{u}</th>)}</tr>
            <tr>
              {["A17", "A18", "A19", "A20", "A21", "A22"].map(k => (
                <ValueCell key={k} value={v("TAB2", k)} />
              ))}
            </tr>
          </thead>
        </table>

        {/* ===== Pressure Transmitter 7–12 ===== */}
        <table className="big-table">
          <thead>
            <tr>{[7, 8, 9, 10, 11, 12].map(n => <th key={n}>Pressure Transmitter {n}</th>)}</tr>
            <tr>{Array(6).fill("mH2O").map((u, i) => <th key={i}>{u}</th>)}</tr>
            <tr>
              {["A9", "A10", "A11", "A12", "A13", "A14"].map(k => (
                <ValueCell key={k} value={v("TAB2", k)} />
              ))}
            </tr>
          </thead>
        </table>

        {/* ===== Pressure Transmitter 1–6 ===== */}
        <table className="big-table">
          <thead>
            <tr>{[1, 2, 3, 4, 5, 6].map(n => <th key={n}>Pressure Transmitter {n}</th>)}</tr>
            <tr>{Array(6).fill("mH2O").map((u, i) => <th key={i}>{u}</th>)}</tr>
            <tr>
              {["A3", "A4", "A5", "A6", "A7", "A8"].map(k => (
                <ValueCell key={k} value={v("TAB2", k)} />
              ))}
            </tr>
          </thead>
        </table>

        {/* ===== Pump 1–6 (ON/OFF from TAB1 A1–A6) ===== */}
        <table className="big-table">
          <thead>
            <tr>{[1, 2, 3, 4, 5, 6].map(n => <th key={n}>Pump {n}</th>)}</tr>
            <tr>
              {["A1", "A2", "A3", "A4", "A5", "A6"].map(k => (
                <ValueCell key={k} value={v("TAB1", k)} mode="pump" />
              ))}
            </tr>
          </thead>
        </table>

        {/* ===== Level Transmitter 1 + 2 ===== */}
        <div className="row center">
          <div className="spacer" /><div className="spacer" />

          <table className="small-table">
            <thead>
              <tr><th>Level Transmitter 1</th></tr>
              <tr><th>M</th></tr>
              <tr><ValueCell value={v("TAB2", "A1")} /></tr>
            </thead>
          </table>

          <table className="small-table">
            <thead>
              <tr><th>Level Transmitter 2</th></tr>
              <tr><th>M</th></tr>
              <tr><ValueCell value={v("TAB2", "A2")} /></tr>
            </thead>
          </table>

          <div className="spacer" /><div className="spacer" />
        </div>
      </div>
    </div>
  );
}
