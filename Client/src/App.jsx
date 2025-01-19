import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store/store";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./components/Login";
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
          <AuthProvider>
            <Router>
              <Navbar />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route path="/create" element={<CreateURL />} />
                <Route path="/overall" element={<OverallStats />} />
                <Route path="/stats/:urlId" element={<URLStats />} />

              </Routes>
            </Router>
          </AuthProvider>
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
