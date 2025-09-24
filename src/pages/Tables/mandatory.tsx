// @ts-nocheck
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import CoreEditor from "../../components/tables/coreTab";
import AdmissionProcessEditor from "../../components/tables/admissionprocesstab";
import MandatoryEditor from "../../components/tables/mandatorytab";

export default function Mandatory() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Mandatory Public Disclosure" />
      <div className="space-y-6">
        <ComponentCard title="Mandatory Public Disclosure">
          <MandatoryEditor />
        </ComponentCard>
      </div>
    </>
  );
}
