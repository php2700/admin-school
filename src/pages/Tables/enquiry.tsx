// @ts-nocheck

import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ContactReqTable from "../../components/tables/contactusTab";
import EnquiryTab from "../../components/tables/enquiryTab";

export default function EnquiryTable() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Enquiry List" />
      <div className="space-y-6">
        <ComponentCard title="Enquiry List">
          <EnquiryTab />
        </ComponentCard>
      </div>
    </>
  );
}
