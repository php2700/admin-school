// @ts-nocheck
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import CbseEditor from "../../components/tables/cbseTables";

export default function CbseTable() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="CBSE" />
      <div className="space-y-6">
        <ComponentCard title="CBSE">
          <CbseEditor />
        </ComponentCard>
      </div>
    </>
  );
}
