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
import { getAllRoles } from "@/services/permissionsAndRoles/permissionsAndRoles";

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}

const Form = () => {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<any[]>([]);
  const [roleName, setRoleName] = useState("");
  const [loading, setLoading] = useState(true);
  const { lang } = useParams();
  const { t } = useTranslate();
  const [allowedRoles, setAllowedRoles] = useState<string[] | null>(null);

  const getMessagesData = async () => {
    setLoading(true);
    try {
      const res = await getAllpermissions(lang);
      setPermissions(
        Array.isArray(res?.body?.permissions) ? res?.body?.permissions : []
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setPermissions([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMessagesData();
  }, [lang]);

  const handleCheckboxChange = (permissionId: any) => {
    setSelectedPermissions((prevSelectedPermissions) => {
      if (prevSelectedPermissions.includes(permissionId)) {
        return prevSelectedPermissions.filter((id) => id !== permissionId);
      } else {
        return [...prevSelectedPermissions, permissionId];
      }
    });
  };
  console.log(selectedPermissions);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const uniquePermissions = Array.from(new Set([...selectedPermissions, 88]));

    const data = {
      name: roleName,
      dashboard_name: "super_admin",
      permissions: uniquePermissions,
    };

    try {
      const res = await CreateRole(data, lang);
      if (res) {
        setSelectedPermissions([]);
        reToast.success(res.message);
      } else {
        reToast.error(t("Failed to create role"));
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      let errorMessage = "Something went wrong.";
      reToast.error(errorMessage);
    }
  };

  return (
    <div>
      {permissions.length === 0 ? (
        <div>No permissions available.</div>
      ) : (
        <>
          <Card className="my-2">
            <CardHeader>
              <CardTitle>{t("Role Info")}</CardTitle>
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
                        className="text-base mx-3 text-muted-foreground dark:text-slate-200 font-normal"
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

export default Form;
