// @ts-nocheck

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ArtEditor from "../../components/tables/artTab";

export default function Art() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Art & Visual Art " />
      <div className="space-y-6">
        <ComponentCard title="Art & Visual Art">
          <ArtEditor />
        </ComponentCard>
      </div>
    </>
  );
}
