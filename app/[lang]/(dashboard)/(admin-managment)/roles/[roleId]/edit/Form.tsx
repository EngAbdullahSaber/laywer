"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  const router = useRouter(); // ✅ initialize router

  const { lang, roleId } = useParams();
  const { t } = useTranslate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const permissionsRes = await getAllpermissions(lang);
      setRolesAndpermissions(
        Array.isArray(permissionsRes?.body?.permissions)
          ? permissionsRes?.body?.permissions
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
    setSelectedPermissions((prevSelectedPermissions) => {
      let newSelectedPermissions = [...prevSelectedPermissions];

      // Define permission groups and their dependencies
      const permissionGroups = [
        {
          main: [134, 135],
          dependent: [208],
        },
        {
          main: [155, 156],
          dependent: [147, 139],
        },
        {
          main: [179, 180],
          dependent: [214],
        },
        {
          main: [140, 141],
          dependent: [133, 147, 160, 202],
        },
        {
          main: [148, 149],
          dependent: [190],
        },
        {
          main: [161, 162],
          dependent: [196],
        },
        {
          main: [221, 222],
          dependent: [133],
        },
      ];

      // Handle all permission groups
      for (const group of permissionGroups) {
        // Check if the changed permission is in a main group
        if (group.main.includes(permissionId)) {
          if (newSelectedPermissions.includes(permissionId)) {
            // If unchecking a main permission
            newSelectedPermissions = newSelectedPermissions.filter(
              (id) => id !== permissionId
            );
            // Only remove dependents if no main permissions are selected
            if (!group.main.some((id) => newSelectedPermissions.includes(id))) {
              newSelectedPermissions = newSelectedPermissions.filter(
                (id) => !group.dependent.includes(id)
              );
            }
          } else {
            // If checking a main permission
            newSelectedPermissions.push(permissionId);
            // Add all dependents if not already present
            group.dependent.forEach((depId) => {
              if (!newSelectedPermissions.includes(depId)) {
                newSelectedPermissions.push(depId);
              }
            });
          }
          return newSelectedPermissions;
        }

        // Check if the changed permission is in a dependent group
        if (group.dependent.includes(permissionId)) {
          if (newSelectedPermissions.includes(permissionId)) {
            // If unchecking a dependent permission
            newSelectedPermissions = newSelectedPermissions.filter(
              (id) => id !== permissionId
            );
            // Also uncheck all main permissions
            newSelectedPermissions = newSelectedPermissions.filter(
              (id) => !group.main.includes(id)
            );
          } else {
            // If checking a dependent permission
            newSelectedPermissions.push(permissionId);
            // Add all main permissions if not already present
            group.main.forEach((mainId) => {
              if (!newSelectedPermissions.includes(mainId)) {
                newSelectedPermissions.push(mainId);
              }
            });
          }
          return newSelectedPermissions;
        }
      }

      // Handle all other permissions normally
      if (newSelectedPermissions.includes(permissionId)) {
        newSelectedPermissions = newSelectedPermissions.filter(
          (id) => id !== permissionId
        );
      } else {
        newSelectedPermissions.push(permissionId);
      }

      return newSelectedPermissions;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const uniquePermissions = Array.from(
      new Set([...selectedPermissions, 128, 218])
    );

    const data = {
      name: roleName,
      dashboard_name: "super_admin",
      permissions: uniquePermissions,
    };

    try {
      const res = await UpdateRole(data, roleId, lang);
      if (res) {
        reToast.success(res.message);
        router.back();
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
        <div>{t("No permissions available")}</div>
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
                      {permission?.name.includes("api")
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
