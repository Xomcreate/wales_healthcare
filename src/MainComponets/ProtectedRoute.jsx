import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import api from "../api/axios";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const location = useLocation();

  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        if (mounted) {
          setUser(null);
          setChecking(false);
        }
        return;
      }

      try {
        const response = await api.get("auth/me/");

        if (!mounted) return;

        setUser(response.data);

        localStorage.setItem(
          "user",
          JSON.stringify(response.data)
        );
      } catch (error) {
        if (!mounted) return;

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");

          setUser(null);
        }
      } finally {
        if (mounted) {
          setChecking(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // -----------------------------------------
  // CHECKING LOGIN
  // -----------------------------------------

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-600">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // -----------------------------------------
  // NOT LOGGED IN
  // -----------------------------------------

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // -----------------------------------------
  // ROLE CHECK
  // -----------------------------------------

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/" replace />;
  }

  // -----------------------------------------
  // AUTHORIZED
  // -----------------------------------------

  return <Outlet />;
};

export default ProtectedRoute;