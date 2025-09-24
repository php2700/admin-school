// @ts-nocheck
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

import VisionEditor from "../../components/tables/visionTab";
import DiffrentEditor from "../../components/tables/diffrenttab";

export default function Diffrent() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Diffrent From Other Section " />
      <div className="space-y-6">
        <ComponentCard title="Diffrent From Other Section ">
          <DiffrentEditor />
        </ComponentCard>
      </div>
    </>
  );
}
