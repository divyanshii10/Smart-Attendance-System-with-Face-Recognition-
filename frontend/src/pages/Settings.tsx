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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure system preferences</p>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      <Card title="Camera Settings" action={<Camera className="w-5 h-5 text-gray-400" />}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Camera Device
            </label>
            <select
              value={settings.cameraId}
              onChange={(e) => setSettings({ ...settings, cameraId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
            >
              <option value="default">Default Camera</option>
              <option value="camera1">Front Camera</option>
              <option value="camera2">Back Camera</option>
              <option value="camera3">External Camera</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Select the camera device for face recognition
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confidence Threshold: {settings.confidenceThreshold}%
            </label>
            <input
              type="range"
              min="50"
              max="100"
              value={settings.confidenceThreshold}
              onChange={(e) =>
                setSettings({ ...settings, confidenceThreshold: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-700"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Less Strict (50%)</span>
              <span>More Strict (100%)</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Minimum confidence level required for successful face recognition
            </p>
          </div>
        </div>
      </Card>

      <Card title="Notification Settings" action={<Bell className="w-5 h-5 text-gray-400" />}>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-medium text-gray-900">Enable Notifications</p>
              <p className="text-sm text-gray-500">Receive alerts for attendance events</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) =>
                setSettings({ ...settings, notificationsEnabled: e.target.checked })
              }
              className="w-5 h-5 text-slate-700 border-gray-300 rounded focus:ring-slate-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-medium text-gray-900">Auto Export Reports</p>
              <p className="text-sm text-gray-500">Automatically export daily reports</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoExport}
              onChange={(e) => setSettings({ ...settings, autoExport: e.target.checked })}
              className="w-5 h-5 text-slate-700 border-gray-300 rounded focus:ring-slate-500"
            />
          </label>
        </div>
      </Card>

      <Card title="System Settings" action={<Database className="w-5 h-5 text-gray-400" />}>
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Database Operations</p>
                <p className="text-xs text-yellow-700 mt-1">
                  These operations will affect your system data. Use with caution.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="md">
              Backup Database
            </Button>
            <Button variant="outline" size="md">
              Export All Data
            </Button>
            <Button variant="danger" size="md" onClick={handleReset}>
              Reset Settings
            </Button>
          </div>
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

      <Card title="System Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Version</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">1.0.0</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Backend Status</p>
            <p className="text-lg font-semibold text-green-600 mt-1">Connected</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Last Backup</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">2 hours ago</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">150</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
