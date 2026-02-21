import { useState, useEffect } from 'react';
import { Camera, Save, AlertTriangle, Bell, Database } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { settingsAPI } from '../services/api';
import type { Settings as SettingsType } from '../types';

export const Settings = () => {
  const [settings, setSettings] = useState<SettingsType>({
    cameraId: 'default',
    confidenceThreshold: 85,
    autoExport: false,
    notificationsEnabled: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsAPI.get();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage('');
    try {
      await settingsAPI.update(settings);
      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        cameraId: 'default',
        confidenceThreshold: 85,
        autoExport: false,
        notificationsEnabled: true
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-[#E5E7EB] font-bold">Settings</h1>
        <p className="text-[#9CA3AF] mt-1">Configure system preferences</p>
      </div>

      {successMessage && (
        <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg p-4">
          <p className="text-sm text-[#10B981]">{successMessage}</p>
        </div>
      )}

      <Card title="Camera Settings">

        <div className="space-y-4">

          {/* Camera Device */}
          <div className="panel-card">
            <label className="text-sm text-[#9CA3AF] block mb-2">
              Camera Device
            </label>

            <select
              value={settings.cameraId}
              onChange={(e) =>
                setSettings({ ...settings, cameraId: e.target.value })
              }
              className="
          w-full bg-transparent
          border border-white/[0.06]
          text-[#E5E7EB]
          px-3 py-2 rounded-lg
          focus:outline-none focus:border-[#4F46E5]/50
          transition
        "
            >
              <option className="bg-[#111827]">Default Camera</option>
              <option className="bg-[#111827]">Front Camera</option>
              <option className="bg-[#111827]">Back Camera</option>
              <option className="bg-[#111827]">External Camera</option>
            </select>

            <p className="text-xs text-[#6B7280] mt-2">
              Select the camera device for face recognition
            </p>
          </div>

          {/* Confidence Slider */}
          <div className="panel-card">
            <label className="text-sm text-[#9CA3AF] block mb-3">
              Confidence Threshold: {settings.confidenceThreshold}%
            </label>

            <input
              type="range"
              min="50"
              max="100"
              value={settings.confidenceThreshold}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  confidenceThreshold: parseInt(e.target.value)
                })
              }
              className="w-full accent-[#4F46E5]"
            />

            <div className="flex justify-between text-xs text-[#6B7280] mt-2">
              <span>Less Strict</span>
              <span>More Strict</span>
            </div>
          </div>

        </div>

      </Card>

      <Card title="Notification Settings">

        <div className="space-y-4">

          {/* Enable Notifications */}
          <label className="panel-card flex justify-between items-center cursor-pointer">

            <div>
              <p className="text-[#E5E7EB] font-medium">
                Enable Notifications
              </p>
              <p className="text-[#9CA3AF] text-sm">
                Receive alerts for attendance events
              </p>
            </div>

            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notificationsEnabled: e.target.checked
                })
              }
              className="accent-[#4F46E5] w-5 h-5"
            />

          </label>

          {/* Auto Export */}
          <label className="panel-card flex justify-between items-center cursor-pointer">

            <div>
              <p className="text-[#E5E7EB] font-medium">
                Auto Export Reports
              </p>
              <p className="text-[#9CA3AF] text-sm">
                Automatically export daily reports
              </p>
            </div>

            <input
              type="checkbox"
              checked={settings.autoExport}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  autoExport: e.target.checked
                })
              }
              className="accent-[#4F46E5] w-5 h-5"
            />

          </label>

        </div>

      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Cancel
        </Button>
        <Button
          variant="primary"
          leftIcon={<Save className="w-5 h-5" />}
          onClick={handleSave}
          isLoading={saving}
        >
          Save Changes
        </Button>
      </div>

      <Card title="System Settings">

        <div className="space-y-4">

          {/* Warning Panel */}
          <div className="panel-card border-yellow-500/30 bg-yellow-500/5">

            <p className="text-yellow-400 font-medium text-sm">
              Database Operations
            </p>

            <p className="text-yellow-300/70 text-xs mt-1">
              These operations will affect your system data. Use with caution.
            </p>

          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">

            <Button variant="outline">
              Backup Database
            </Button>

            <Button variant="outline">
              Export All Data
            </Button>

            <Button variant="danger" onClick={handleReset}>
              Reset Settings
            </Button>

          </div>

        </div>

      </Card>
    </div>
  );
};
