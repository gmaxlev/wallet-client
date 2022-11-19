import { memo, useMemo } from "react";
import { AxiosError } from "axios";
import { Alert, Box } from "@mui/material";
import { styled } from "@mui/material";
import { useTranslation } from "react-i18next";
import React from "react";

interface Props {
  serverData?: any;
  unknownMessage?: string;
}

function parseMessage(message: unknown) {
  if (Array.isArray(message)) {
    return message.map((item) => String(item));
  } else if (typeof message === "string") {
    return [message];
  } else {
    return null;
  }
}

export default memo(
  styled(function UserFriendlyError({
    serverData,
    unknownMessage,
    ...other
  }: Props) {
    const { t } = useTranslation();

    const errors = useMemo(() => {
      if (!serverData) {
        return null;
      }

      if (
        serverData instanceof AxiosError &&
        serverData?.response?.data?.userFriendly === true &&
        serverData?.response?.data?.message
      ) {
        return parseMessage(serverData?.response?.data?.message);
      }
      return parseMessage([
        unknownMessage ? unknownMessage : t("unknownError"),
      ]);
    }, [serverData]);

    if (!errors) {
      return null;
    }

    return (
      <Box sx={{ mt: 3, mb: 3 }} {...other}>
        {errors.map((error, index) => (
          <Alert severity={"error"} sx={{ mt: 1, mb: 1 }} key={index}>
            {error}
          </Alert>
        ))}
      </Box>
    );
  })({})
);
