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
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import { ThemeContext } from "../../components/common/ThemeProvider";

const { Option } = Select;

export default function Setting() {
  const { i18n, t } = useTranslation("common");
  const [language, setLanguage] = useState(i18n.language || "en");
  const { theme, setTheme, primaryColor, setPrimaryColor } =
    useContext(ThemeContext);

  // Save to localStorage
  const handleSave = () => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("primaryColor", primaryColor);
    localStorage.setItem("language", language);
    message.success(t("Settings saved!"));
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
      i18n.changeLanguage(savedLang);
    }
  }, []);

  const handleLanguageChange = (lng: string) => {
    setLanguage(lng);
    i18n.changeLanguage(lng);
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
  };

  return (
    <AdminLayout>
      <Card
        title={t("System Settings")}
        style={{ maxWidth: 600, margin: "0 auto" }}
      >
        <Form layout="vertical">
          <Form.Item label={t("Language")}>
            <Select value={language} onChange={handleLanguageChange}>
              <Option value="en">English</Option>
              <Option value="th">ไทย</Option>
              <Option value="zh">中文 (China)</Option>
            </Select>
          </Form.Item>
          <Form.Item label={t("Theme")}>
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
              <span>{t("Primary Color") || "Primary Color"}:</span>
              <ColorPicker
                showText
                value={primaryColor}
                onChange={(color) => setPrimaryColor(color.toHexString())}
                presets={[{ label: "Default", colors: ["#07377E"] }]}
              />
            </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSave}>
              Save Settings
            </Button>
          </Form.Item>
        </Form>
        <Card title={t("Information")} style={{ marginTop: 32 }}>
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

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || "en", ["common"])),
  },
});
