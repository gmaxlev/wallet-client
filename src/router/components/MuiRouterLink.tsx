import { useLinkClickHandler } from "react-router-dom";
import * as React from "react";
import { Link as MuiLink } from "@mui/material";
import { styled } from "@mui/material";
import { forwardRef } from "react";

const MuiRouterLink = forwardRef<
  HTMLElement,
  React.ComponentProps<typeof MuiLink> & { href: string }
>((props, ref) => {
  const handler = useLinkClickHandler(props.href);

  return (
    <MuiLink
      {...props}
      href={props.href}
      onClick={(event) => {
        if (props.onClick) {
          props.onClick(event);
        }
        if (!event.defaultPrevented) {
          handler(event as React.MouseEvent<any>);
        }
      }}
    >
      {props.children}
    </MuiLink>
  );
});

export default styled(MuiRouterLink)({}) as unknown as typeof MuiRouterLink;
