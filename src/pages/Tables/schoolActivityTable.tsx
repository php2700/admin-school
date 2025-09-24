// @ts-nocheck

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import WelcomeEditor from "../../components/tables/welcomeTables";
import SchoolActivity from "../../components/tables/schoolActivityTables";

export default function SchoolActivityTable() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="School Activity " />
      <div className="space-y-6">
        <ComponentCard title="School Activity ">
          <SchoolActivity />
        </ComponentCard>
      </div>
    </>
  );
}
