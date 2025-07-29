import AdminLayout from "../../components/admin/AdminLayout";
import {
  Card,
  Form,
  Select,
  Button,
  Descriptions,
  ColorPicker,
  message,
} from "antd";
import React, { useState, useContext } from "react";
import { LogoutOutlined } from "@ant-design/icons";
import { ThemeContext } from "../../components/common/ThemeProvider";

const { Option } = Select;

export default function Setting() {
  const [language, setLanguage] = useState("en");
  const { theme, setTheme, primaryColor, setPrimaryColor } =
    useContext(ThemeContext);

  // Save to localStorage
  const handleSave = () => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("primaryColor", primaryColor);
    localStorage.setItem("language", language);
    message.success("Settings saved!");
  };

  // Restore from localStorage (optional, for first load)
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedColor = localStorage.getItem("primaryColor");
    const savedLang = localStorage.getItem("language");
    if (savedTheme) setTheme(savedTheme);
    if (savedColor) setPrimaryColor(savedColor);
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const handleLanguageChange = (lng: string) => {
    setLanguage(lng);
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
  };

  // เพิ่ม logout function
  const handleLogout = async () => {
    try {
      // Simulate logout (remove actual API call)
      // const session = localStorage.getItem('session');
      // if (session) {
      //   await fetch(`http://192.168.1.99/logout.fcgi?session=${session}`, {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   });
      // }

      // Simulate logout delay
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear localStorage
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      localStorage.removeItem("session");

      // Redirect to login page
      window.location.href = "/login";
    }
  };

  return (
    <AdminLayout>
      <Card title="System Settings" style={{ maxWidth: 600, margin: "0 auto" }}>
        <Form layout="vertical">
          <Form.Item label="Language">
            <Select value={language} onChange={handleLanguageChange}>
              <Option value="en">English</Option>
              <Option value="th">ไทย</Option>
              <Option value="zh">中文 (China)</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Theme">
            <Select
              value={theme}
              onChange={handleThemeChange}
              style={{ marginBottom: 16 }}
            >
              <Option value="light">Light</Option>
              <Option value="dark">Dark</Option>
              <Option value="system">System</Option>
            </Select>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span>Primary Color:</span>
              <ColorPicker
                showText
                value={primaryColor}
                onChange={(color) => setPrimaryColor(color.toHexString())}
                presets={[{ label: "Default", colors: ["#07377E"] }]}
              />
            </div>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={handleSave}
              style={{ marginRight: 8 }}
            >
              Save Settings
            </Button>
            <Button icon={<LogoutOutlined />} danger onClick={handleLogout}>
              Logout
            </Button>
          </Form.Item>
        </Form>
        <Card title="Information" style={{ marginTop: 32 }}>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="IP">192.168.1.100</Descriptions.Item>
            <Descriptions.Item label="License">HID-1234-5678</Descriptions.Item>
            <Descriptions.Item label="OTC">OTC-987654</Descriptions.Item>
          </Descriptions>
        </Card>
      </Card>
    </AdminLayout>
  );
}
