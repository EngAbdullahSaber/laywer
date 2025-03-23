"use client";
import { Auth } from "@/components/auth/Auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";
import {
  CreateRole,
  getAllpermissions,
} from "@/services/permissionsAndRoles/permissionsAndRoles";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}
const page = () => {
  const [permissions, setPermissions] = useState<any[]>([]); // Ensure it's an array
  const [selectedPermissions, setSelectedPermissions] = useState<any[]>([]); // To store selected permissions
  const [roleName, setRoleName] = useState(""); // Role name state
  const [loading, setLoading] = useState(true);
  const { lang } = useParams();
  const { t } = useTranslate();

  const getMessagesData = async () => {
    setLoading(true);

    try {
      const res = await getAllpermissions(lang);
      // Check if the response is an array, otherwise set an empty array
      setPermissions(
        Array.isArray(res?.body?.permissions) ? res?.body?.permissions : []
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setPermissions([]); // Ensure it's set to an empty array on error
      setLoading(false);
    }
  };

  useEffect(() => {
    getMessagesData();
  }, [lang]); // Add lang as a dependency to refetch if language changes

  const handleCheckboxChange = (permissionId: any) => {
    // Add or remove permission from selectedPermissions
    setSelectedPermissions((prevSelectedPermissions) => {
      if (prevSelectedPermissions.includes(permissionId)) {
        return prevSelectedPermissions.filter((id) => id !== permissionId); // Remove if already selected
      } else {
        return [...prevSelectedPermissions, permissionId]; // Add if not selected
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data to send to the backend
    const data = {
      name: roleName,
      dashboard_name: "super_admin",
      permissions: selectedPermissions, // List of selected permissions
    };

    try {
      const res = await CreateRole(data, lang); // Call API to create the lawyer
      if (res) {
        setSelectedPermissions([]);
        reToast.success(res.message); // Display success message
      } else {
        reToast.error(t("Failed to create role")); // Show a fallback failure message
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      let errorMessage = "Something went wrong."; // Default fallback message
      reToast.error(errorMessage); // Display the error message in the toast
    }
  };
  console.log(selectedPermissions);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {permissions.length === 0 ? (
        <div>No permissions available.</div>
      ) : (
        <>
          <Card className="my-2">
            <CardHeader>
              <CardTitle>Role Info</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row justify-start items-center">
              <Label htmlFor="Name" className="w-[35%]">
                {t("Role Name")}
              </Label>
              <Input
                type="text"
                className="w-[65%]"
                placeholder={t("Enter Role Name")}
                name="title"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
              />
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit}>
            {permissions.map((item: any) => (
              <Card key={item.id} className="my-2">
                <CardHeader>
                  <CardTitle>
                    {t(item?.parent_key.split(".")[1].replace("::", " "))}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row justify-start items-center">
                  {item.permissions.map((permission: any) => (
                    <div className="w-[20%]" key={permission?.id}>
                      <Checkbox
                        id={permission?.id}
                        checked={selectedPermissions.includes(permission?.id)}
                        onCheckedChange={() =>
                          handleCheckboxChange(permission?.id)
                        }
                      />
                      <Label
                        htmlFor={permission?.id}
                        className="text-base mx-3 text-muted-foreground font-normal"
                      >
                        {permission?.name}
                      </Label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-center gap-3 mt-4">
              <Button
                type="submit"
                className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {t("Create Role")}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

const allowedRoles = ["super_admin"];

const ProtectedComponent = Auth({ allowedRoles })(page);

export default ProtectedComponent;
