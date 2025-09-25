// @ts-nocheck
import {
      Table,
      TableBody,
      TableCell,
      TableHeader,
      TableRow,
} from "../ui/table";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdmissionEnquiry() {
      const [userData, setUserData] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState("");
      const [page, setPage] = useState(1);
      const [totalPages, setTotalPages] = useState(1);
      const [limit] = useState(10);

      const getUserList = async () => {
            try {
                  setLoading(true);

                  const token = localStorage.getItem("shriRamSchoolToken");

                  const response = await axios.get(
                        `${
                              import.meta.env.VITE_APP_URL
                        }api/admin/admission-enquiry-list?page=${page}&limit=${limit}`,
                        {
                              headers: {
                                    Authorization: `Bearer ${token}`,
                              },
                        }
                  );
                  console.log(response.data);
                  setUserData(response.data?.data);
                  setTotalPages(response.data.pagination.totalPages);
            } catch (err) {
                  setError(
                        err.response?.data?.message || "Something went wrong"
                  );
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            getUserList();
      }, [page]);

      if (loading) return <p>Loading Admission Enquiry List...</p>;
      if (error) return <p className="text-red-500">{error}</p>;
      console.log(userData, "ghhhhhhh");
      return (
            <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                  <div className=" overflow-y-auto overflow-x-auto">
                        {" "}
                        {/* Adjusted height and scroll */}
                        <Table>
                              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] sticky top-0 bg-white dark:bg-white/[0.03]">
                                    <TableRow>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                Name
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                gender
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                dob
                                          </TableCell>

                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                nationality
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                classForAdmission
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                schoolAndClassLastAttended
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                lastSchoolAffiliation
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                previousClassResult
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                motherName
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                motherDob
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                motherEducation
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                motherEmail
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                motherMobile
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                motherOccupation
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                motherDesignation
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                motherOrganization
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                motherOfficeAddress
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                fatherName
                                          </TableCell>

                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                fatherDob
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                fatherEducation
                                          </TableCell>

                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                fatherEmail
                                          </TableCell>

                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                fatherMobile
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                fatherOccupation
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                fatherDesignation
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                fatherOrganization
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                fatherOfficeAddress
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                residentialAddress
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                phoneNumber
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                maritalStatus
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                motherTongue
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                photo
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                under
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                isAccept
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                siblings
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                created
                                          </TableCell>
                                    </TableRow>
                              </TableHeader>

                              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {userData.map((user) => (
                                          <TableRow key={user.id}>
                                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                      <div className="flex items-center gap-3">
                                                            <div>
                                                                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                                        {
                                                                              user.name
                                                                        }
                                                                  </span>
                                                            </div>
                                                      </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.gender}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {new Date(
                                                            user.dob
                                                      ).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.nationality}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.classForAdmission}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {
                                                            user.schoolAndClassLastAttended
                                                      }
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {
                                                            user.lastSchoolAffiliation
                                                      }
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.previousClassResult}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.motherName}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {new Date(
                                                            user.motherDob
                                                      ).toLocaleDateString()}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.motherEducation}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.motherEmail}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.motherMobile}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.motherOccupation}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.motherDesignation}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.motherOrganization}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.motherOfficeAddress}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.fatherName}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {new Date(
                                                            user.fatherDob
                                                      ).toLocaleDateString()}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.fatherEducation}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.fatherEmail}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.fatherMobile}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.fatherOccupation}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.fatherDesignation}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.fatherOrganization}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.fatherOfficeAddress}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.residentialAddress}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.phoneNumber}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.maritalStatus}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.motherTongue}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.photo ? (
                                                            <img
                                                                  src={`${
                                                                        import.meta
                                                                              .env
                                                                              .VITE_APP_URL
                                                                  }${
                                                                        user.photo
                                                                  }`}
                                                                  className="h-12 w-12"
                                                            />
                                                      ) : (
                                                            "N/A"
                                                      )}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.underTaking}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.isAccept == "true"
                                                            ? "true"
                                                            : "false"}
                                                </TableCell>{" "}
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.siblings?.length
                                                            ? user.siblings
                                                                    ?.length
                                                            : "N/A"}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {new Date(
                                                            user.createdAt
                                                      ).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {new Date(
                                                            user.createdAt
                                                      ).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {new Date(
                                                            user.createdAt
                                                      ).toLocaleDateString()}
                                                </TableCell>
                                          </TableRow>
                                    ))}
                              </TableBody>
                        </Table>
                  </div>
            </div>
      );
}
