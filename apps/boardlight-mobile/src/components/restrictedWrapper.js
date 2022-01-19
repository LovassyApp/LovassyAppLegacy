import React from "react";
import { useSelector } from "react-redux";

export const RestrictedWrapper = (props) => {
  const control = useSelector((state) => state.control.value);

  if (props.permission && control.permissions.includes(props.permission)) {
    return props.children;
  } else if (
    props.permissions &&
    control.permission.some((item) => props.permissions.includes(item))
  ) {
    return props.children;
  }

  return "";
};
