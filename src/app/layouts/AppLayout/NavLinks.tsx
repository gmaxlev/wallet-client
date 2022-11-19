import { List, ListItem } from "@mui/material";
import React from "react";
import NavLink, { NavLinkType } from "./NavLink";

interface Props {
  items: NavLinkType[];
  onClick?: () => unknown;
}

export function NavLinks({ items, onClick }: Props) {
  return (
    <List>
      {items.map(({ text, Icon, link, action, end }, index) => (
        <ListItem key={index} disablePadding sx={{ display: "block" }}>
          <NavLink
            text={text}
            link={link}
            action={action}
            Icon={Icon}
            onClick={onClick}
            end={end}
          />
        </ListItem>
      ))}
    </List>
  );
}
