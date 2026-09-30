import AdminPortal from "../../components/AdminPortal";

export const metadata = {
  title: "Admin Access Control // Jeeva Krishnasamy",
  description:
    "Secure mainframe portal for publishing, editing technical blog articles, and moderating visitor transmissions.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminPortal />;
}
