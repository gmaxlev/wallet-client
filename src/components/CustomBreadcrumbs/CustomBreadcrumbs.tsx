import { Link, SvgIconTypeMap, Typography } from "@mui/material";
import { Link as LinkReactRouter } from "react-router-dom";
import { Breadcrumbs } from "@mui/material";
import React from "react";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { memo } from "react";

interface Props {
  chain: Array<{
    to: string;
    text: string;
    Icon?: OverridableComponent<SvgIconTypeMap>;
  }>;
  current: string;
}

export default memo(function CustomBreadcrumbs({ chain, current }: Props) {
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      {chain.map(({ to, text, Icon }, index) => {
        return (
          <Link
            underline={"hover"}
            component={LinkReactRouter}
            to={to}
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
            key={index}
          >
            {Icon && <Icon fontSize={"inherit"} sx={{ mr: 0.5 }} />}
            {text}
          </Link>
        );
      })}

      <Typography color="text.primary">{current}</Typography>
    </Breadcrumbs>
  );
});
