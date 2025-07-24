import React from "react";
import { Button, Result } from "antd";
import { useRouter } from "next/router";

interface ErrorResultProps {
  status: "403" | "404" | "500";
  title?: string;
  subTitle?: string;
  backHome?: boolean;
}

const defaultSubTitles: Record<"403" | "404" | "500", string> = {
  "403": "Sorry, you are not authorized to access this page.",
  "404": "Sorry, the page you visited does not exist.",
  "500": "Sorry, something went wrong.",
};

const ErrorResult: React.FC<ErrorResultProps> = ({
  status,
  title,
  subTitle,
  backHome = true,
}) => {
  const router = useRouter();
  return (
    <Result
      status={status}
      title={title || status}
      subTitle={subTitle || defaultSubTitles[status]}
      extra={
        backHome && (
          <Button type="primary" onClick={() => router.push("/")}>
            Back Home
          </Button>
        )
      }
    />
  );
};

export default ErrorResult;
