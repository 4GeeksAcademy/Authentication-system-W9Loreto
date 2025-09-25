// src/pages/Private.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Private() {
    const navigate = useNavigate();

    return (
        <div className="container py-5" style={{ maxWidth: 720 }}>
            <div className="card p-4 shadow-sm">
                <h1 className="h4 mb-3">Private (placeholder)</h1>
                <p className="mb-4">
                    Simple page shown after a successful sign-in. No authentication or tokens involved yet.
                </p>
                <div className="mt-2">
                    <button className="btn btn-outline-primary" onClick={() => navigate("/")}>
                        Back to Home
                    </button>
                </div>
                <div className="mt-2">
                    <button className="btn btn-outline-secondary">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
