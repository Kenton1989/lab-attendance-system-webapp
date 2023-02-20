import { ColumnsType } from "antd/es/table";
import { User, RequestOptions } from "../../api";
import { Rule } from "antd/es/form";
import { ChangeEvent } from "react";

export const LISTABLE_ROLES = ["staff", "admin"];
export const CREATABLE_ROLES = ["admin"];
export const DESTROYABLE_ROLES = ["admin"];

export const USER_COLUMNS: ColumnsType<User> = [
  {
    title: "Username",
    dataIndex: "username",
    width: "8em",
  },
  {
    title: "Name",
    dataIndex: "display_name",
  },
  {
    title: "Email",
    dataIndex: "email",
    width: "16em",
  },
];

export function formatUserItemPath(user: User) {
  return `/users/${user.id}`;
}

export function formatUsername(e: ChangeEvent<HTMLInputElement>) {
  e.target.value = e.target.value.toUpperCase();
}

export const USER_RETRIEVE_PARAMS: RequestOptions<User> = {
  urlParams: {
    fields: [
      "id",
      "username",
      "display_name",
      "email",
      "roles",
      "role_ids",
      "is_active",
    ],
  },
};

export const VALIDATE_PASSWORD_CONFIRM: Rule = ({ getFieldValue }) => {
  return {
    async validator(_, confirmValue) {
      const enteredValue = getFieldValue("password");
      if (enteredValue && enteredValue !== confirmValue) {
        throw new Error("two passwords you entered do not match");
      }
    },
  };
};
