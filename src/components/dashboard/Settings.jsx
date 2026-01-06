import React, { useState } from 'react';
import { useOutletContext } from 'react-router';
import {
  Save, Globe, Shield, Bell, CreditCard, Mail, Lock,
  Database, Users, FileText, Palette, Zap, CheckCircle,
  AlertCircle, Upload, Trash2
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const Settings = () => {
  const { user } = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // General
    siteName: 'PawMart',
    siteDescription: 'Premium Pet Marketplace',
    contactEmail: 'support@pawmart.com',
    contactPhone: '+1 (555) 123-4567',
    maintenanceMode: false,
    
    // Security
    require2FA: true,
    passwordStrength: 'medium',
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    orderNotifications: true,
    systemAlerts: true,
    
    // Payment
    stripeEnabled: true,
    paypalEnabled: true,
    currency: 'USD',
    taxRate: 8.5,
    
    // Appearance
    theme: 'light',
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    logoUrl: '',
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to localStorage or API
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      const defaults = {
        siteName: 'PawMart',
        siteDescription: 'Premium Pet Marketplace',
        contactEmail: 'support@pawmart.com',
        contactPhone: '+1 (555) 123-4567',
        maintenanceMode: false,
        require2FA: true,
        passwordStrength: 'medium',
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        emailNotifications: true,
        pushNotifications: true,
        orderNotifications: true,
        systemAlerts: true,
        stripeEnabled: true,
        paypalEnabled: true,
        currency: 'USD',
        taxRate: 8.5,
        theme: 'light',
        primaryColor: '#3b82f6',
        secondaryColor: '#8b5cf6',
        logoUrl: '',
      };
      setSettings(defaults);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Name
          </label>
          <input
            type="text"
            name="siteName"
            value={settings.siteName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Description
          </label>
          <input
            type="text"
            name="siteDescription"
            value={settings.siteDescription}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Email
          </label>
          <input
            type="email"
            name="contactEmail"
            value={settings.contactEmail}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Phone
          </label>
          <input
            type="tel"
            name="contactPhone"
            value={settings.contactPhone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="font-medium text-gray-900">Maintenance Mode</p>
          <p className="text-sm text-gray-600">Temporarily disable the site for maintenance</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="maintenanceMode"
            checked={settings.maintenanceMode}
            onChange={handleInputChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="font-medium text-gray-900">Two-Factor Authentication</p>
          <p className="text-sm text-gray-600">Require 2FA for all admin accounts</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="require2FA"
            checked={settings.require2FA}
            onChange={handleInputChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password Strength
          </label>
          <select
            name="passwordStrength"
            value={settings.passwordStrength}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="very-high">Very High</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            name="sessionTimeout"
            value={settings.sessionTimeout}
            onChange={handleInputChange}
            min="5"
            max="120"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Login Attempts
          </label>
          <input
            type="number"
            name="maxLoginAttempts"
            value={settings.maxLoginAttempts}
            onChange={handleInputChange}
            min="1"
            max="10"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">Security Tips</p>
            <ul className="mt-2 text-sm text-blue-800 space-y-1">
              <li>• Enable Two-Factor Authentication for all admin accounts</li>
              <li>• Use strong password requirements</li>
              <li>• Regularly update admin passwords</li>
              <li>• Monitor login attempts and failed logins</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      {[
        { name: 'emailNotifications', label: 'Email Notifications', description: 'Receive email alerts for important events' },
        { name: 'pushNotifications', label: 'Push Notifications', description: 'Enable browser push notifications' },
        { name: 'orderNotifications', label: 'Order Notifications', description: 'Notify about new orders and updates' },
        { name: 'systemAlerts', label: 'System Alerts', description: 'Receive system and maintenance alerts' },
      ].map((item) => (
        <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">{item.label}</p>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name={item.name}
              checked={settings[item.name]}
              onChange={handleInputChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Stripe Payments</p>
            <p className="text-sm text-gray-600">Enable credit card payments via Stripe</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="stripeEnabled"
              checked={settings.stripeEnabled}
              onChange={handleInputChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">PayPal Payments</p>
            <p className="text-sm text-gray-600">Enable PayPal payment gateway</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="paypalEnabled"
              checked={settings.paypalEnabled}
              onChange={handleInputChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            name="currency"
            value={settings.currency}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="CAD">CAD ($)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tax Rate (%)
          </label>
          <input
            type="number"
            name="taxRate"
            value={settings.taxRate}
            onChange={handleInputChange}
            min="0"
            max="30"
            step="0.1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </label>
          <select
            name="theme"
            value={settings.theme}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo URL
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              name="logoUrl"
              value={settings.logoUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/logo.png"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Upload className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              name="primaryColor"
              value={settings.primaryColor}
              onChange={handleInputChange}
              className="w-12 h-12 cursor-pointer rounded-lg"
            />
            <input
              type="text"
              value={settings.primaryColor}
              readOnly
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Secondary Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              name="secondaryColor"
              value={settings.secondaryColor}
              onChange={handleInputChange}
              className="w-12 h-12 cursor-pointer rounded-lg"
            />
            <input
              type="text"
              value={settings.secondaryColor}
              readOnly
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>
      </div>
      
      <div className="p-4 border rounded-lg">
        <p className="font-medium text-gray-900 mb-3">Preview</p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded-lg"
              style={{ backgroundColor: settings.primaryColor }}
            ></div>
            <span>Primary Color</span>
          </div>
          <div className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded-lg"
              style={{ backgroundColor: settings.secondaryColor }}
            ></div>
            <span>Secondary Color</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure platform settings and preferences</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'payment' && renderPaymentSettings()}
          {activeTab === 'appearance' && renderAppearanceSettings()}
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">System Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Database className="h-5 w-5 text-gray-600 mr-2" />
              <p className="font-medium text-gray-900">Database</p>
            </div>
            <p className="text-sm text-gray-600">Version: PostgreSQL 14.5</p>
            <p className="text-sm text-gray-600">Size: 245 MB</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Zap className="h-5 w-5 text-gray-600 mr-2" />
              <p className="font-medium text-gray-900">Server</p>
            </div>
            <p className="text-sm text-gray-600">Status: Running</p>
            <p className="text-sm text-gray-600">Uptime: 99.8%</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-gray-600 mr-2" />
              <p className="font-medium text-gray-900">Users</p>
            </div>
            <p className="text-sm text-gray-600">Total: 1,245</p>
            <p className="text-sm text-gray-600">Active: 892</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;