"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Auth } from "@/components/auth/Auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";
import {
  CreateRole,
  getAllpermissions,
  getSpecifiedRole,
  UpdateRole,
  getAllRoles,
} from "@/services/permissionsAndRoles/permissionsAndRoles";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}
const Form = () => {
  const [RolesAndpermissions, setRolesAndpermissions] = useState<any[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<any[]>([]);
  const [roleName, setRoleName] = useState("");
  const [roleData, setRoleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { lang, roleId } = useParams();
  const { t } = useTranslate();

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
              acc.push(permission.id);
            });
            return acc;
          },
          []
        );

        setSelectedPermissions(flattenedPermissions);
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

  const handleCheckboxChange = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

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

  return (
    <div>
      {RolesAndpermissions.length === 0 ? (
        <div>No permissions available.</div>
      ) : (
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
                      className="text-base mx-3 dark:text-slate-200 text-muted-foreground font-normal"
                    >
                      {permission?.name === "api.block"
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
      )}
    </div>
  );
};

export default Form;
