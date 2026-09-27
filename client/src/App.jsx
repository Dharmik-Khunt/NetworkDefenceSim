import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Overview from "./pages/Overview";
import Alerts from "./pages/Alerts";
import Events from "./pages/Events";
import Agents from "./pages/Agents";
import Network from "./pages/Network";
import ThreatHunting from "./pages/ThreatHunting";
import Scenarios from "./pages/Scenarios";
import Incidents from "./pages/Incidents";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Response from "./pages/Response";


import "./App.css";


function App() {

  return (

    <BrowserRouter>

      <div className="soc-layout">

        <Sidebar />

        <div className="main-area">

          <Header />

          <main className="content-area">

            <Routes>

              <Route
                path="/"
                element={<Overview />}
              />

              <Route
                path="/alerts"
                element={<Alerts />}
              />

              <Route
                path="/events"
                element={<Events />}
              />

              <Route
                path="/agents"
                element={<Agents />}
              />

              <Route
                path="/network"
                element={<Network />}
              />

              <Route
                path="/threat-hunting"
                element={<ThreatHunting />}
              />

              <Route
                path="/scenarios"
                element={<Scenarios />}
              />

              <Route
                path="/incidents"
                element={<Incidents />}
              />

              <Route path="/response"
                element={<Response />}
              />

              <Route
                path="/analytics"
                element={<Analytics />}
              />

              <Route
                path="/reports"
                element={<Reports />}
              />

              <Route
                path="/settings"
                element={<Settings />}
              />

            </Routes>

          </main>

        </div>

      </div>

    </BrowserRouter>

  );

}


export default App;