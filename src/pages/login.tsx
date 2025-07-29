import React, { useState } from "react";
import { Form, Input, Button, Card, message, Typography, Space } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import Head from "next/head";

const { Title, Text } = Typography;

// Glassmorphism style for login card
const glassCardStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.25)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: 20,
  border: "1px solid rgba(255, 255, 255, 0.18)",
  padding: "40px",
  minWidth: "400px",
  maxWidth: "500px",
};

export default function Login() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { login: string; password: string }) => {
    setLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Simulate successful login (remove actual API call)
      // const response = await fetch('http://192.168.1.99/hidlogin.fcgi', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     login: values.login,
      //     password: values.password,
      //   }),
      // });

      // Simulate successful login response
      const mockSession = "mock_session_" + Date.now();

      message.success("Login successful!");

      // Store login state and session
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify({ login: values.login }));
      localStorage.setItem("session", mockSession);

      // Redirect to admin dashboard
      router.push("/admin/users");
    } catch (error) {
      console.error("Login error:", error);
      message.error("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>HID Amigo - Login</title>
        <meta name="description" content="Login to HID Amigo Web Service" />
      </Head>

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <Card style={glassCardStyle}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <Title level={2} style={{ color: "#333", marginBottom: "8px" }}>
              HID Amigo
            </Title>
            <Text type="secondary" style={{ fontSize: "16px" }}>
              Web Service Login
            </Text>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="login"
              rules={[
                { required: true, message: "Please enter your username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                placeholder="Username"
                style={{ borderRadius: "8px" }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                placeholder="Password"
                style={{ borderRadius: "8px" }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<LoginOutlined />}
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Text type="secondary" style={{ fontSize: "14px" }}>
              Enter your credentials to access the system
            </Text>
          </div>
        </Card>
      </div>
    </>
  );
}
