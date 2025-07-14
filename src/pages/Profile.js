import React, { useState, useEffect } from 'react';
import './Profile.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Profile = () => {
  const defaultImage = '/default-image1.png';

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    profileImage: null,
    imagePreview: defaultImage,
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [toastVisible, setToastVisible] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notification Preferences state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsAlerts: false,
  });

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) return;

    fetch(`http://localhost:5000/api/user/${username}`)
      .then(res => res.json())
      .then(data => {
        setProfile(prev => ({
          ...prev,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          country: data.country,
          imagePreview: data.profileImage || defaultImage,
        }));
      })
      .catch(err => {
        console.error('Failed to fetch profile', err);
      });
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({
        ...profile,
        profileImage: file,
        imagePreview: URL.createObjectURL(file),
      });
    } else {
      setProfile({
        ...profile,
        profileImage: null,
        imagePreview: defaultImage,
      });
    }
  };

  const handleImageError = () => {
    setProfile((prev) => ({
      ...prev,
      imagePreview: defaultImage,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = localStorage.getItem('username');
    const formData = new FormData();
    formData.append('fullName', profile.fullName);
    formData.append('email', profile.email);
    formData.append('phone', profile.phone);
    formData.append('country', profile.country);
    if (profile.profileImage) {
      formData.append('profileImage', profile.profileImage);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/user/${username}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to update profile');

      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('New password and confirmation do not match');
      return;
    }

    const username = localStorage.getItem('username');
    const passwordData = {
      currentPassword,
      newPassword,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/user/change-password/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) throw new Error('Failed to update password');

      alert('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
    } catch (err) {
      console.error('Error updating password:', err);
      alert('Error updating password');
    }
  };

  // Handle Notification Preferences Change
  const handleNotificationsChange = (e) => {
    setNotifications({
      ...notifications,
      [e.target.name]: e.target.checked,
    });
  };

  // Handle Notifications Preferences submit
  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();

    const username = localStorage.getItem('username');
    const preferencesData = {
      emailNotifications: notifications.emailNotifications,
      smsAlerts: notifications.smsAlerts,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/user/update-notifications/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferencesData),
      });

      if (!response.ok) throw new Error('Failed to update preferences');

      alert('Notification preferences updated successfully');
    } catch (err) {
      console.error('Error updating preferences:', err);
      alert('Error updating preferences');
    }
  };

  return (
    <div className="sky-funded-profile-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        <p>Manage your personal information and settings</p>
      </div>

      <div className="profile-tabs">
        <button onClick={() => setActiveTab('personal')} className={activeTab === 'personal' ? 'active' : ''}>Personal Info</button>
        <button onClick={() => setActiveTab('security')} className={activeTab === 'security' ? 'active' : ''}>Security</button>
        <button onClick={() => setActiveTab('preferences')} className={activeTab === 'preferences' ? 'active' : ''}>Preferences</button>
      </div>

      {activeTab === 'personal' && (
        <div className="profile-card">
          <div className="avatar-section">
            <img
              src={profile.imagePreview}
              onError={handleImageError}
              alt="Profile"
              className="avatar-img"
            />
            <label className="upload-btn">
              Change Photo
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row">
              <label>Full Name</label>
              <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Email</label>
              <input type="email" name="email" value={profile.email} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Phone</label>
              <input type="text" name="phone" value={profile.phone} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Country</label>
              <input type="text" name="country" value={profile.country} onChange={handleChange} />
            </div>
            <button type="submit" className="save-btn">Save Changes</button>
          </form>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="profile-card">
          {!isChangingPassword ? (
            <button className="change-password-btn" onClick={() => setIsChangingPassword(true)}>Change Password</button>
          ) : (
            <div>
              <h3>Change Password</h3>
              <form onSubmit={handlePasswordChange}>
                <div className="form-row">
                  <label>Current Password</label>
                  <div className="password-container">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                      {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <div className="form-row">
                  <label>New Password</label>
                  <div className="password-container">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}>
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <div className="form-row">
                  <label>Confirm Password</label>
                  <div className="password-container">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="save-btn">Update Password</button>
              </form>
            </div>
          )}
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="profile-card">
          <form onSubmit={handlePreferencesSubmit}>
            <div className="form-row">
              <label>Email Notifications</label>
              <input
                type="checkbox"
                name="emailNotifications"
                checked={notifications.emailNotifications}
                onChange={handleNotificationsChange}
              />
            </div>

            <div className="form-row">
              <label>SMS Alerts</label>
              <input
                type="checkbox"
                name="smsAlerts"
                checked={notifications.smsAlerts}
                onChange={handleNotificationsChange}
              />
            </div>

            <button type="submit" className="save-btn">Save Preferences</button>
          </form>
        </div>
      )}

      {toastVisible && <div className="toast">Profile updated successfully</div>}
    </div>
  );
};

export default Profile;
