// @ts-nocheck

import { useEffect, useState } from "react";
import {

  BoxIconLine,
  GroupIcon,
} from "../../icons";
import axios from "axios";

export default function EcommerceMetrics() {
  const [data, setData] = useState();

  const getCount = async () => {
    try {
      const token = localStorage.getItem("shriRamSchoolToken");

      const response = await axios.get(
        `${import.meta.env.VITE_APP_URL}api/admin/count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response?.data);
    } catch (error) {
      console.log(error, "gggg");
    }
  };

  // useEffect(() => {
  //   getCount();
  // }, []);

  console.log(data, "aaq");
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
    </div>
  );
}
