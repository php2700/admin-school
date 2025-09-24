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

export default function TourTable() {
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
                        }api/admin/take-tour-list?page=${page}&limit=${limit}`,
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

      if (loading) return <p>Loading loans...</p>;
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
                                                Student Name
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                Parent Name
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                Email
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                Mobile
                                          </TableCell>

                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                Class
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                Section
                                          </TableCell>
                                          <TableCell
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                          >
                                                Message
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
                                                                              user.studentName
                                                                        }
                                                                  </span>
                                                            </div>
                                                      </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.parentName ? user.parentName: 'N/A' }
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.email}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.phone}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.studentClass}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.studentSection}
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                      {user.message}
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
                        <div className="flex justify-end items-center mt-4">
                              <button
                                    disabled={page === 1}
                                    onClick={() => setPage((prev) => prev - 1)}
                                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                              >
                                    Prev
                              </button>

                              <span>
                                    Page {page} of {totalPages}
                              </span>

                              <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage((prev) => prev + 1)}
                                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                              >
                                    Next
                              </button>
                        </div>
                  </div>
            </div>
      );
}
