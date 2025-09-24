// @ts-nocheck

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// import ComponentCard from "../../components/common/ComponentCard";
import ComponentCard from "../../components/common/Componentcard"; 
import PageMeta from "../../components/common/PageMeta";
import TourTable from "../../components/tables/tourTab";

export default function TakeTourTable() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Take tour List" />
      <div className="space-y-6">
        <ComponentCard title="Take tours List">
          <TourTable />
        </ComponentCard>
      </div>
    </>
  );
}
