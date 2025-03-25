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
  getSpecifiedRole,
  UpdateRole,
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

const Page = () => {
  const [RolesAndpermissions, setRolesAndpermissions] = useState<any[]>([]); // All permissions
  const [selectedPermissions, setSelectedPermissions] = useState<any[]>([2]); // Selected permissions
  const [roleName, setRoleName] = useState(""); // Role name
  const [roleData, setRoleData] = useState<any>(null); // Role data
  const [loading, setLoading] = useState(true);

  const { lang, roleId } = useParams();
  const { t } = useTranslate();

  // Fetch permissions and role data
  const fetchData = async () => {
    setLoading(true);
    try {
      const permissionsRes = await getAllpermissions(lang);
      setRolesAndpermissions(
        Array.isArray(permissionsRes?.body?.permissions)
          ? permissionsRes.body.permissions.filter((permission: any) =>
              [
                3, 6, 12, 20, 27, 33, 39, 42, 45, 51, 57, 63, 69, 75, 81, 87,
              ].includes(permission.id)
            )
          : []
      );

      if (roleId) {
        const roleRes = await getSpecifiedRole(lang, roleId);
        setRoleData(roleRes.body);
        setRoleName(roleRes.body?.role?.name);
        const flattenedPermissions = roleRes.body?.role?.permissions.reduce(
          (acc: any[], item: any) => {
            item.permissions.forEach((permission: any) => {
              acc.push(permission.id); // Push the nested permission ids into the array
            });
            return acc;
          },
          []
        );

        setSelectedPermissions(flattenedPermissions); // Pre-select role permissions
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lang, roleId]);

  // Handle checkbox changes
  const handleCheckboxChange = (permissionId: any) => {
    setSelectedPermissions(
      (prev) =>
        prev.includes(permissionId)
          ? prev.filter((id) => id !== permissionId) // Remove if already selected
          : [...prev, permissionId] // Add if not selected
    );
  };
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name: roleName,
      dashboard_name: "super_admin",
      permissions: selectedPermissions,
    };

    try {
      const res = await UpdateRole(data, roleId, lang);
      if (res) {
        reToast.success(res.message);
      } else {
        reToast.error(t("Failed to create role"));
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      reToast.error(axiosError.message || "Something went wrong.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {RolesAndpermissions.length === 0 ? (
        <div>No permissions available.</div>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            {RolesAndpermissions.map((item: any) => (
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
                        {permission?.name == "api.block"
                          ? t(permission?.name.split(".")[1])
                          : permission?.name}
                      </Label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-center gap-3 mt-4">
              <Button
                type="submit"
                className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {t("Update Permission For Role")}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

const allowedRoles = ["super_admin", "admin", "secretary"];
const ProtectedComponent = Auth({ allowedRoles })(Page);

export default ProtectedComponent;
