"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast as reToast } from "react-hot-toast";
import { useTranslate } from "@/config/useTranslation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import BasicSelect from "@/components/common/Select/BasicSelect";
import { AxiosError } from "axios";
import { getCategory } from "@/services/category/category";
import { useParams } from "next/navigation";
import { CreateCourts, getCities, getRegions } from "@/services/courts/courts";
import InfiniteScrollSelect from "./InfiniteScrollSelect";
import CreateCourtCategory from "../../../(category-mangement)/court-category/CreateCourtCategory";

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}

interface CourtData {
  name: string;
  category_id: string;
  email: string;
  address: string;
  website: string;
  room_number: string;
  region_id: string;
  city_id: string;
}

const Page = () => {
  const { t } = useTranslate();
  const { lang } = useParams();

  const [category, setCategory] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [flag, setFlag] = useState(false);

  const [courtData, setCourtData] = useState<CourtData>({
    name: "",
    category_id: "",
    email: "",
    address: "",
    website: "",
    room_number: "",
    region_id: "",
    city_id: "",
  });

  // Fetch cities when region changes
  const fetchCitiesData = async (regionId: string, page: number = 1) => {
    try {
      const citiesData = await getCities(regionId, lang);
      return citiesData?.body?.data || [];
    } catch (error) {
      reToast.error("Failed to fetch cities");
      return [];
    }
  };

  // Format city options for the select component
  const formatCityOption = (city: any) => ({
    value: city.id,
    label: city.name,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCourtData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedValue: any, field: string) => {
    setCourtData((prevData) => ({
      ...prevData,
      [field]: selectedValue?.id,
    }));

    if (field === "region_id") {
      setCities([]); // Clear cities when region changes
      setCourtData((prevData) => ({
        ...prevData,
        city_id: "", // Reset city when region changes
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(courtData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const res = await CreateCourts(formData, lang);
      if (res) {
        setCourtData({
          name: "",
          category_id: "",
          email: "",
          address: "",
          website: "",
          room_number: "",
          region_id: "",
          city_id: "",
        });
        reToast.success(res.message);
      } else {
        reToast.error(t("Failed to create Court"));
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      let errorMessage = "Something went wrong.";
      Object.keys(courtData).forEach((field) => {
        const fieldErrorKey = `${field}`;
        const error = axiosError.response?.data?.errors?.[fieldErrorKey];
        if (error) {
          errorMessage = error[0];
        }
      });
      reToast.error(errorMessage);
    }
  };

  const transformedCategories = category.map((item) => ({
    id: item.id,
    value: item.name,
    label: item.name,
  }));

  const transformedRegions = regions.map((item) => ({
    id: item.id,
    value: item.name,
    label: item.name,
  }));

  const fetchData = async () => {
    try {
      const categoriesData = await getCategory("courts", lang);
      const regionsData = await getRegions(lang);
      setCategory(categoriesData?.body?.data || []);
      setRegions(regionsData?.body || []);
    } catch (error) {
      reToast.error("Failed to fetch categories or regions");
    }
  };

  useEffect(() => {
    fetchData();
  }, [flag]);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{t("Create Court")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col justify-between">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Court Name */}
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-2"
              >
                <Label htmlFor="Name">{t("Court Name")}</Label>
                <Input
                  type="text"
                  placeholder={t("Enter Court Name")}
                  name="name"
                  value={courtData.name}
                  onChange={handleInputChange}
                />
              </motion.div>

              {/* Court Category */}
              <div className="flex flex-col gap-2">
                <motion.div
                  initial={{ y: -50 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="flex flex-row justify-between items-center"
                >
                  <div className="!w-[87%]" style={{ width: "87%" }}>
                    <Label htmlFor="CourtCategory">
                      {t("Court Category Level")}
                    </Label>
                    <BasicSelect
                      menu={transformedCategories}
                      setSelectedValue={(value) =>
                        handleSelectChange(value, "category_id")
                      }
                      selectedValue={courtData["category_id"]}
                    />
                  </div>
                  <div className="w-[8%] mt-5">
                    <CreateCourtCategory buttonShape={false} />
                  </div>{" "}
                </motion.div>
              </div>

              {/* Email */}
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-2"
              >
                <Label htmlFor="Email">{t("Email")}</Label>
                <Input
                  type="text"
                  placeholder={t("Enter Email")}
                  name="email"
                  value={courtData.email}
                  onChange={handleInputChange}
                />
              </motion.div>

              {/* Website */}
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-2"
              >
                <Label htmlFor="Website">{t("Court Website")}</Label>
                <Input
                  type="text"
                  placeholder={t("Enter Court Website")}
                  name="website"
                  value={courtData.website}
                  onChange={handleInputChange}
                />
              </motion.div>

              {/* Address */}
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.9 }}
                className="flex flex-col gap-2"
              >
                <Label htmlFor="Address">{t("Address")}</Label>
                <Input
                  type="text"
                  placeholder={t("Enter Address")}
                  name="address"
                  value={courtData.address}
                  onChange={handleInputChange}
                />
              </motion.div>

              {/* Room Number */}
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1 }}
                className="flex flex-col gap-2"
              >
                <Label htmlFor="Room_Number">{t("Room Number")}</Label>
                <Input
                  type="number"
                  placeholder={t("Enter Room Number")}
                  name="room_number"
                  value={courtData.room_number}
                  onChange={handleInputChange}
                />
              </motion.div>

              {/* Region */}
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.1 }}
                className="flex flex-col gap-2"
              >
                <Label htmlFor="Region">{t("Region")}</Label>
                <BasicSelect
                  menu={transformedRegions}
                  setSelectedValue={(value) =>
                    handleSelectChange(value, "region_id")
                  }
                  selectedValue={courtData["region_id"]}
                />
              </motion.div>

              {/* City */}
              {courtData.region_id && (
                <motion.div
                  initial={{ y: -50 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 1.2 }}
                  className="flex flex-col gap-2"
                >
                  <Label htmlFor="City">{t("City")}</Label>
                  <InfiniteScrollSelect
                    fetchData={(page) =>
                      fetchCitiesData(courtData.region_id, page)
                    }
                    formatOption={formatCityOption}
                    placeholder={t("Search or Select a City")}
                    selectedValue={courtData.city_id}
                    setSelectedValue={(value) =>
                      setCourtData((prevData) => ({
                        ...prevData,
                        city_id: value?.value || "",
                      }))
                    }
                  />
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.3 }}
              className="flex justify-center gap-3 mt-4"
            >
              <Button
                type="button"
                className="w-28 border-[#dfc77d] hover:!bg-[#dfc77d] hover:!border-[#dfc77d] !text-black"
                variant="outline"
              >
                {t("Cancel")}
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                className="!bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {t("Create Court")}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
