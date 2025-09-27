"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import { Auth } from "@/components/auth/Auth";
import { getAllRoles } from "@/services/permissionsAndRoles/permissionsAndRoles";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

interface FormProps {
  asDialog?: boolean;
  dialogTrigger?: React.ReactNode;
  onSuccess?: () => void;
}

// Animation variants for consistent animations
const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Form content component with animations (for standalone form)
const FormContentWithAnimations = React.memo(
  ({
    courtData,
    handleInputChange,
    handleSelectChange,
    handleCitySelectChange,
    handleSubmit,
    loading,
    t,
    transformedCategories,
    transformedRegions,
    fetchCitiesData,
    formatCityOption,
    setFlag,
    flag,
  }: any) => (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{t("Create Court")}</CardTitle>
        </CardHeader>
        <CardContent className="min-w-xl">
          <motion.div
            variants={staggerChildren}
            initial="initial"
            animate="animate"
            className="flex flex-col justify-between"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Court Name */}
              <motion.div
                key="court-name"
                variants={fadeInUp}
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
              <motion.div
                key="court-category"
                variants={fadeInUp}
                className="flex flex-col gap-2"
              >
                <div className="flex flex-row justify-between items-center">
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
                    <CreateCourtCategory
                      buttonShape={false}
                      setFlag={setFlag}
                      flag={flag}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Room Number */}
              <motion.div
                key="room-number"
                variants={fadeInUp}
                className="flex flex-col gap-2"
              >
                <Label htmlFor="Room_Number">{t("Room Number")}</Label>
                <Input
                  type="text"
                  placeholder={t("Enter Room Number")}
                  name="room_number"
                  value={courtData.room_number}
                  onChange={handleInputChange}
                />
              </motion.div>

              {/* Region */}
              <motion.div
                key="region"
                variants={fadeInUp}
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

              {/* City - Only show when region is selected */}
              {courtData.region_id && (
                <motion.div
                  key="city"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
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
                      handleCitySelectChange(value)
                    }
                  />
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <motion.div
              key="submit-button"
              variants={fadeInUp}
              className="flex justify-center gap-3 mt-4"
            >
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={!loading}
                className="!bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {!loading ? t("Loading") : t("Create Court")}
              </Button>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
);

FormContentWithAnimations.displayName = "FormContentWithAnimations";

// Form content component without animations (for dialog)
const FormContentWithoutAnimations = React.memo(
  ({
    courtData,
    handleInputChange,
    handleSelectChange,
    handleCitySelectChange,
    handleSubmit,
    loading,
    t,
    transformedCategories,
    transformedRegions,
    fetchCitiesData,
    formatCityOption,
    setFlag,
    flag,
  }: any) => (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{t("Create Court")}</CardTitle>
        </CardHeader>
        <CardContent className="min-w-xl">
          <div className="flex flex-col justify-between">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Court Name */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="Name">{t("Court Name")}</Label>
                <Input
                  type="text"
                  placeholder={t("Enter Court Name")}
                  name="name"
                  value={courtData.name}
                  onChange={handleInputChange}
                />
              </div>

              {/* Court Category */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between items-center">
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
                    <CreateCourtCategory
                      buttonShape={false}
                      setFlag={setFlag}
                      flag={flag}
                    />
                  </div>
                </div>
              </div>

              {/* Room Number */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="Room_Number">{t("Room Number")}</Label>
                <Input
                  type="text"
                  placeholder={t("Enter Room Number")}
                  name="room_number"
                  value={courtData.room_number}
                  onChange={handleInputChange}
                />
              </div>

              {/* Region */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="Region">{t("Region")}</Label>
                <BasicSelect
                  menu={transformedRegions}
                  setSelectedValue={(value) =>
                    handleSelectChange(value, "region_id")
                  }
                  selectedValue={courtData["region_id"]}
                />
              </div>

              {/* City - Only show when region is selected */}
              {courtData.region_id && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="City">{t("City")}</Label>
                  <InfiniteScrollSelect
                    fetchData={(page) =>
                      fetchCitiesData(courtData.region_id, page)
                    }
                    formatOption={formatCityOption}
                    placeholder={t("Search or Select a City")}
                    selectedValue={courtData.city_id}
                    setSelectedValue={(value) =>
                      handleCitySelectChange(value)
                    }
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center gap-3 mt-4">
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={!loading}
                className="!bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {!loading ? t("Loading") : t("Create Court")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
);

FormContentWithoutAnimations.displayName = "FormContentWithoutAnimations";

const CourtForm = ({
  asDialog = false,
  dialogTrigger,
  onSuccess,
}: FormProps) => {
  const { t } = useTranslate();
  const { lang } = useParams();
  const [loading, setIsloading] = useState(true);
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
  const [data, setData] = useState<any>([]);
  const [allowedRoles, setAllowedRoles] = useState<string[] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  // Fetch cities when region changes
  const fetchCitiesData = useCallback(
    async (regionId: string, page: number = 1) => {
      try {
        const citiesData = await getCities(regionId, lang);
        return citiesData?.body?.data || [];
      } catch (error) {
        reToast.error("Failed to fetch cities");
        return [];
      }
    },
    [lang]
  );

  // Format city options for the select component
  const formatCityOption = useCallback(
    (city: any) => ({
      value: city.id,
      label: city.name,
    }),
    []
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setCourtData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    },
    []
  );

  const handleSelectChange = useCallback(
    (selectedValue: any, field: string) => {
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
    },
    []
  );

  // Special handler for city selection since InfiniteScrollSelect returns the option object
  const handleCitySelectChange = useCallback((selectedOption: any) => {
    setCourtData((prevData) => ({
      ...prevData,
      city_id: selectedOption?.value || "",
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsloading(false);

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
          setIsloading(true);

          reToast.success(res.message);

          // Call onSuccess callback if provided
          if (onSuccess) {
            onSuccess();
          }

          // Close dialog if in dialog mode
          if (asDialog) {
            setDialogOpen(false);
          } else {
            router.back();
          }
        } else {
          reToast.error(t("Failed to create Court"));
          setIsloading(true);
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
        setIsloading(true);
      }
    },
    [courtData, lang, onSuccess, asDialog, router, t]
  );

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

  // Render as dialog if asDialog prop is true
  if (asDialog) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          {dialogTrigger || (
            <Button variant="outline">{t("Create Court")}</Button>
          )}
        </DialogTrigger>
        <DialogContent className="min-w-[800px] h-auto overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("Create a New Court")}</DialogTitle>
          </DialogHeader>
          <FormContentWithoutAnimations
            courtData={courtData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleCitySelectChange={handleCitySelectChange}
            handleSubmit={handleSubmit}
            loading={loading}
            t={t}
            transformedCategories={transformedCategories}
            transformedRegions={transformedRegions}
            fetchCitiesData={fetchCitiesData}
            formatCityOption={formatCityOption}
            setFlag={setFlag}
            flag={flag}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // Render as standalone form by default
  return (
    <FormContentWithAnimations
      courtData={courtData}
      handleInputChange={handleInputChange}
      handleSelectChange={handleSelectChange}
      handleCitySelectChange={handleCitySelectChange}
      handleSubmit={handleSubmit}
      loading={loading}
      t={t}
      transformedCategories={transformedCategories}
      transformedRegions={transformedRegions}
      fetchCitiesData={fetchCitiesData}
      formatCityOption={formatCityOption}
      setFlag={setFlag}
      flag={flag}
    />
  );
};

export default CourtForm;