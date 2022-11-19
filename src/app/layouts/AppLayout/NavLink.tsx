import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import React, { useMemo } from "react";
import { Link, useMatch, useNavigate } from "react-router-dom";

export interface NavLinkType {
  text: string;
  link?: string;
  action?: () => unknown;
  Icon: React.ComponentType;
  end: boolean;
}

interface Props extends NavLinkType {
  onClick?: () => unknown;
}

export default function NavLink({
  text,
  link,
  action,
  Icon,
  onClick,
  end,
}: Props) {
  const navigate = useNavigate();
  const isMatched = useMatch(
    link
      ? {
          path: link,
          end,
        }
      : ""
  );
  const isActive = useMemo(() => {
    return !!link && !!isMatched;
  }, [link, isMatched]);

  function handleClickOption(
    event: React.MouseEvent,
    link?: string,
    action?: () => unknown
  ) {
    event.preventDefault();
    if (link) {
      navigate(link);
    } else if (action) {
      action();
    }
    if (onClick) {
      onClick();
    }
  }

  return (
    <ListItem
      button
      sx={{
        minHeight: 48,
        justifyContent: "initial",
        px: 2.5,
      }}
      {...(link && { to: link, component: Link })}
      onClick={(event) => handleClickOption(event, link, action)}
      selected={isActive}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: 3,
          justifyContent: "center",
        }}
      >
        <Icon />
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
}
