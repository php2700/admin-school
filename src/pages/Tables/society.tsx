// @ts-nocheck

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ArtEditor from "../../components/tables/artTab";
import SocietyEditor from "../../components/tables/societytab";

export default function Society() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Society & Clubs" />
      <div className="space-y-6">
        <ComponentCard title="Society & Clubs">
          <SocietyEditor />
        </ComponentCard>
      </div>
    </>
  );
}
