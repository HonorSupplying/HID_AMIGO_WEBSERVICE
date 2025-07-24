import React from "react";
import { Spin, Alert, Flex } from "antd";

interface LoadingSpinnerProps {
  tip?: string;
  alertMessage?: string;
  alertDescription?: string;
  size?: "small" | "default" | "large";
}

const contentStyle = {
  padding: 50,
  background: "rgba(0, 0, 0, 0.05)",
  borderRadius: 4,
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  tip = "Loading...",
  alertMessage,
  alertDescription,
  size = "large",
}) => (
  <Flex
    gap="middle"
    vertical
    align="center"
    justify="center"
    style={{ minHeight: 200 }}
  >
    {alertMessage ? (
      <Spin tip={tip} size={size}>
        <Alert
          message={alertMessage}
          description={alertDescription}
          type="info"
        />
      </Spin>
    ) : (
      <Spin tip={tip} size={size}>
        <div style={contentStyle} />
      </Spin>
    )}
  </Flex>
);

export default LoadingSpinner;
