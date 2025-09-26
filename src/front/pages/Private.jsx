// src/pages/Private.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Private() {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/"); // sin token -> volver
            return;
        }

        const loadProfile = async () => {
            try {
                const resp = await fetch(`${backendUrl}/api/profile`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (resp.status === 401) {
                    // no válido o expirado
                    sessionStorage.removeItem("token");
                    navigate("/");
                    return;
                }

                if (!resp.ok) {
                    const data = await resp.json().catch(() => ({}));
                    setError(data?.error || "Error cargando perfil");
                    return;
                }

                const data = await resp.json();
                setProfile(data);
            } catch (e) {
                setError("Network error");
            }
        };

        loadProfile();
    }, [backendUrl, navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div className="container py-5" style={{ maxWidth: 720 }}>
            <div className="card p-4 shadow-sm">
                <h1 className="h4 mb-3">Private</h1>

                {error && <div className="alert alert-danger">{error}</div>}

                {!profile ? (
                    <p className="mb-0">Cargando perfil…</p>
                ) : (
                    <>
                        <p className="mb-2"><strong>Email:</strong> {profile.email}</p>
                        {profile.profile && (
                            <ul className="mb-3">
                                <li><strong>Bio:</strong> {profile.profile.bio}</li>
                                <li><strong>GitHub:</strong> {profile.profile.github}</li>
                            </ul>
                        )}
                    </>
                )}

                <div className="text-center mt-3">
                    <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
}
