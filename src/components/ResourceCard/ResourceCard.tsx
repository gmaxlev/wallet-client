import {
  alpha,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MuiRouterLink from "../../router/components/MuiRouterLink";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";

export interface ResourceCardProps {
  isNew?: boolean;
  editLinkOrAction?: string | (() => unknown);
  removeLinkOrAction?: string | (() => unknown);
  children: React.ReactNode | React.ReactNode[];
}

export default memo(function ResourceCard({
  isNew = false,
  editLinkOrAction,
  removeLinkOrAction,
  children,
}: ResourceCardProps) {
  const { t } = useTranslation();

  const editIsLink = typeof editLinkOrAction === "string";
  const editIsAction = typeof editLinkOrAction === "function";

  const removeIsLink = typeof removeLinkOrAction === "string";
  const removeIsAction = typeof removeLinkOrAction === "function";

  const isShowActions = editLinkOrAction || removeLinkOrAction;

  return (
    <Box
      sx={(theme) => ({
        width: "100%",
        display: "flex",
        borderRadius: 1,
        ...(isNew && {
          boxShadow: `0 0 0 5px ${alpha(theme.palette.success.main, 0.2)}`,
        }),
      })}
    >
      <Card
        sx={(theme) => ({
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        })}
      >
        <CardContent>{children}</CardContent>
        {isShowActions && (
          <CardActions sx={{ justifyContent: "space-between" }}>
            {editLinkOrAction ? (
              <Button
                size={"small"}
                startIcon={<EditIcon />}
                {...(editIsAction && { onClick: editLinkOrAction })}
                {...(editIsLink && {
                  component: MuiRouterLink,
                  href: editLinkOrAction,
                })}
              >
                {t("resourceCard.edit")}
              </Button>
            ) : (
              <span></span>
            )}

            {removeLinkOrAction && (
              <IconButton
                size={"small"}
                {...(removeIsAction && { onClick: removeLinkOrAction })}
                {...(removeIsLink && {
                  component: MuiRouterLink,
                  href: removeLinkOrAction,
                })}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </CardActions>
        )}
      </Card>
    </Box>
  );
});
