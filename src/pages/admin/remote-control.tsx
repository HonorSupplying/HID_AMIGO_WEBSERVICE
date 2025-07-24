import AdminLayout from "../../components/admin/AdminLayout";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("../../components/admin/MapView"), {
  ssr: false,
});

export default function RemoteControlPage() {
  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <div style={{ width: "100%", height: 500 }}>
          <MapView />
        </div>
      </div>
    </AdminLayout>
  );
}
