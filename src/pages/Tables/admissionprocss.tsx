// @ts-nocheck
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import CoreEditor from "../../components/tables/coreTab";
import AdmissionProcessEditor from "../../components/tables/admissionprocesstab";

export default function AdmissionProcess() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Admission Process" />
      <div className="space-y-6">
        <ComponentCard title="Admission Process">
          <AdmissionProcessEditor />
        </ComponentCard>
      </div>
    </>
  );
}
