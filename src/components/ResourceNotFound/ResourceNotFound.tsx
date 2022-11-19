import { Alert, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import React from "react";
interface Props {
  children?: React.ReactNode;
}

export default function ResourceNotFound(props: Props) {
  const { t } = useTranslation();
  return (
    <>
      <Typography
        variant={"h3"}
        component={"h1"}
        fontWeight={"bold"}
        color={"error"}
        mb={3}
      >
        {t("resourcesNotFound.title")}
      </Typography>
      <Alert severity={"error"}>
        {props.children ? props.children : t("resourcesNotFound.content")}
      </Alert>
    </>
  );
}
