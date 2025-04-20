import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Profile.css";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState("");
    const [profilePic, setProfilePic] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/api/profile/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data);
                setFormData(res.data.profile || {});
                setProfilePic(res.data.profile?.profilePic || "");
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value.split(",").map((v) => v.trim()),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.put("http://localhost:5000/api/profile/me", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage("✅ Profile updated successfully!");
            setEditing(false);
        } catch (err) {
            console.error("Error updating profile:", err);
            setMessage("❌ Failed to update profile.");
        }
    };

    if (!user) return <p className="loading-text">Loading...</p>;

    return (
        <div className="profile-container">
            <div className="profile-card animate-pop">
                <h2>Your Profile</h2>
                {message && <p className="message">{message}</p>}

                {!editing ? (
                    <>
                        <div className="profile-row">
                            <div className="profile-label">Name:</div>
                            <div className="profile-value">{user.name}</div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-label">Email:</div>
                            <div className="profile-value">{user.email}</div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-label">Role:</div>
                            <div className="profile-value">{user.role}</div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-label">Age:</div>
                            <div className="profile-value">{formData.age || "-"}</div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-label">Gender:</div>
                            <div className="profile-value">{formData.gender || "-"}</div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-label">Height:</div>
                            <div className="profile-value">{formData.height || "-"} cm</div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-label">Weight:</div>
                            <div className="profile-value">{formData.weight || "-"} kg</div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-label">Medical History:</div>
                            <div className="profile-value">{(formData.medicalHistory || []).join(", ")}</div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-label">Allergies:</div>
                            <div className="profile-value">{(formData.allergies || []).join(", ")}</div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-label">Assigned Dietitian:</div>
                            <div className="profile-value">{formData.assignedDietitian || "Not Assigned"}</div>
                        </div>
                        <button className="edit-btn" onClick={() => setEditing(true)}>Edit</button>
                    </>
                ) : (
                    <form onSubmit={handleSubmit} className="profile-form">
                        <label>Age:
                            <input type="number" name="age" value={formData.age || ""} onChange={handleChange} />
                        </label>
                        <label>Gender:
                            <select name="gender" value={formData.gender || ""} onChange={handleChange}>
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </label>
                        <label>Height (cm):
                            <input type="number" name="height" value={formData.height || ""} onChange={handleChange} />
                        </label>
                        <label>Weight (kg):
                            <input type="number" name="weight" value={formData.weight || ""} onChange={handleChange} />
                        </label>
                        <label>Medical History:
                            <input type="text" name="medicalHistory" value={(formData.medicalHistory || []).join(", ")} onChange={(e) => handleArrayChange("medicalHistory", e.target.value)} />
                        </label>
                        <label>Allergies:
                            <input type="text" name="allergies" value={(formData.allergies || []).join(", ")} onChange={(e) => handleArrayChange("allergies", e.target.value)} />
                        </label>
                        <button type="submit" className="save-btn">Save</button>
                        <button type="button" className="cancel-btn" onClick={() => setEditing(false)}> Cancel</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;
