// @ts-nocheck

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import WelcomeEditor from "../../components/tables/welcomeTab";
import FaqTables from "../../components/tables/faqTab";

export default function FaqTable() {
      return (
            <>
                  <PageMeta
                        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
                  />
                  <PageBreadcrumb pageTitle="Faqs " />
                  <div className="space-y-6">
                        <ComponentCard title="faqs ">
                              <FaqTables />
                        </ComponentCard>
                  </div>
            </>
      );
}
