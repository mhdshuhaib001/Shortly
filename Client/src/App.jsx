import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store/store";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Dashboard from "./components/DashBoard";
import OverallStats from "./components/Analytics/OverallStats";
import CreateURL from "./components/URL/CreateURL";
import URLStats from "./components/Analytics/URLStats";
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}
        >
          <Router>
            <AuthProvider>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/create"
                  element={
                    <PrivateRoute>
                      <CreateURL />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/overall"
                  element={
                    <PrivateRoute>
                      <OverallStats />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/stats/:urlId"
                  element={
                    <PrivateRoute>
                      <URLStats />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </AuthProvider>
          </Router>
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
