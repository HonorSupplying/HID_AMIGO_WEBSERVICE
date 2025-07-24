import AdminLayout from "../../components/admin/AdminLayout";
import {
  Card,
  Select,
  Button,
  Table,
  Space,
  Input,
  message,
  Row,
  Col,
} from "antd";
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const { Option } = Select;

const initialCameras = [
  {
    key: 1,
    name: "Main Entrance",
    ip: "192.168.1.101",
    status: "Online",
    streamUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    key: 2,
    name: "Back Door",
    ip: "192.168.1.102",
    status: "Offline",
    streamUrl: "https://www.w3schools.com/html/movie.mp4",
  },
];

export function CameraSection() {
  const [cameras, setCameras] = useState(initialCameras);
  const [selected, setSelected] = useState(1);
  const [addName, setAddName] = useState("");
  const [addIp, setAddIp] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [splitView, setSplitView] = useState(false);

  const handleSync = () =>
    message.success("Sync with camera successful! (mock)");
  const handleAdd = () => {
    if (!addName || !addIp)
      return message.warning("Please enter camera name and IP");
    setCameras([
      ...cameras,
      {
        key: Date.now(),
        name: addName,
        ip: addIp,
        status: "Online",
        streamUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
    ]);
    setAddName("");
    setAddIp("");
    message.success("Camera added!");
  };

  const selectedCamera = cameras.find((cam) => cam.key === selected);
  const selectedCameras = cameras.filter((cam) =>
    selectedRowKeys.includes(cam.key)
  );

  const handleViewSelected = () => {
    if (selectedRowKeys.length === 0 || selectedRowKeys.length > 9) return;
    const html = `
      <html><head><title>Camera Grid</title></head><body style='margin:0;padding:0;'>
      <div style='display:grid;grid-template-columns:repeat(${Math.ceil(
        Math.sqrt(selectedRowKeys.length)
      )},1fr);gap:8px;height:100vh;'>
        ${selectedCameras
          .map(
            (cam) => `
          <div style='background:#000;display:flex;align-items:center;justify-content:center;height:100%;'>
            <video src='${cam.streamUrl}' controls autoplay style='width:100%;height:100%;object-fit:contain;background:#000;'></video>
            <div style='position:absolute;top:8px;left:8px;color:#fff;background:rgba(0,0,0,0.5);padding:2px 8px;border-radius:4px;'>${cam.name}</div>
          </div>
        `
          )
          .join("")}
      </div></body></html>
    `;
    const win = window.open();
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  const handleSplitView = () => {
    setSplitView(selectedRowKeys.length === 2);
  };

  return (
    <Card
      title="Camera Management"
      style={{ maxWidth: 1700, margin: "0 auto" }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Space>
          <span>Select Camera:</span>
          <Select
            value={selected}
            onChange={setSelected}
            style={{ minWidth: 180 }}
          >
            {cameras.map((cam) => (
              <Option key={cam.key} value={cam.key}>
                {cam.name}
              </Option>
            ))}
          </Select>
          <Button onClick={handleSync}>Sync</Button>
          <span style={{ marginLeft: 16 }}>
            IP: <b>{selectedCamera?.ip}</b>
          </span>
          <span>
            Status:{" "}
            <b
              style={{
                color: selectedCamera?.status === "Online" ? "green" : "red",
              }}
            >
              {selectedCamera?.status}
            </b>
          </span>
        </Space>
        {/* Main video or split view */}
        {splitView && selectedCameras.length === 2 ? (
          <Row gutter={16} style={{ marginTop: 0, marginBottom: 16 }}>
            {selectedCameras.map((cam) => (
              <Col xs={24} md={12} key={cam.key}>
                <Card title={cam.name}>
                  <video
                    style={{ width: "100%", height: 320, background: "#000" }}
                    controls
                    autoPlay
                    src={cam.streamUrl}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <>
            <div
              style={{ width: "100%", textAlign: "center", margin: "0 -24px" }}
            >
              <video
                style={{ width: "100%", height: "auto", maxWidth: "100%" }}
                controls
                poster="https://dummyimage.com/640x360/07377E/fff&text=Camera+Stream"
              >
                <source
                  src="https://www.w3schools.com/html/mov_bbb.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <div style={{ marginTop: 16, color: "#888" }}>
                * ตัวอย่างวิดีโอสตรีม (RTSP/ONVIF) จริงจะฝังที่นี่
              </div>
            </div>
          </>
        )}
        <Card type="inner" title="Add Camera">
          <Space>
            <Input
              placeholder="Camera Name"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
            />
            <Input
              placeholder="IP Address"
              value={addIp}
              onChange={(e) => setAddIp(e.target.value)}
            />
            <Button type="primary" onClick={handleAdd}>
              Add Camera
            </Button>
          </Space>
        </Card>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <Button
            type="primary"
            disabled={
              selectedRowKeys.length === 0 || selectedRowKeys.length > 9
            }
            onClick={handleViewSelected}
          >
            View Selected (New Tab)
          </Button>
          <Button
            disabled={selectedRowKeys.length !== 2}
            onClick={handleSplitView}
          >
            View 2 Cameras (Split View)
          </Button>
        </div>
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys as number[]),
            type: "checkbox",
          }}
          dataSource={cameras}
          columns={[
            { title: "Name", dataIndex: "name" },
            { title: "IP", dataIndex: "ip" },
            { title: "Status", dataIndex: "status" },
          ]}
          size="small"
          pagination={false}
          style={{ marginTop: 16 }}
        />
      </Space>
    </Card>
  );
}

export default function CameraPage() {
  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <CameraSection />
      </div>
    </AdminLayout>
  );
}
