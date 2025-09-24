// @ts-nocheck

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import WelcomeEditor from "./welcomeTab";
import FaqTables from "./faqTab";
import FacilityEditor from "../../components/tables/facilityTables";
import EnvironmentEditor from "./environmentTab";

export default function Environment() {
      return (
            <>
                  <PageMeta
                        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
                  />
                  <PageBreadcrumb pageTitle="Learning Environment " />
                  <div className="space-y-6">
                        <ComponentCard title="Learning Environment ">
                              <EnvironmentEditor />
                        </ComponentCard>
                  </div>
            </>
      );
}
