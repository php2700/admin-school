// @ts-nocheck
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import AdmissionEnquiry from "../../components/tables/admisssionEnqTab";

export default function AdmissionEnqTables() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Admissison Enquiry" />
      <div className="space-y-6">
        <ComponentCard title="Admissison Enquiry">
          <AdmissionEnquiry />
        </ComponentCard>
      </div>
    </>
  );
}
