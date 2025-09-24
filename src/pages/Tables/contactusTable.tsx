// @ts-nocheck
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ContactReqTable from "../../components/tables/contactusTable";

export default function ContactUsReqTables() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="contact us Request List" />
      <div className="space-y-6">
        <ComponentCard title="contact us Request">
          <ContactReqTable />
        </ComponentCard>
      </div>
    </>
  );
}
