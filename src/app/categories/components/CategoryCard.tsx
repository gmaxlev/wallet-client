import { Typography } from "@mui/material";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import CategoryDto from "../../../api/resources/category/Category.dto";
import ResourceCard, {
  ResourceCardProps,
} from "../../../components/ResourceCard/ResourceCard";
import { useInject } from "../../../ioc/container";
import { RoutingService } from "../../../router/RoutingService";

type Props = {
  category: CategoryDto;
} & Omit<ResourceCardProps, "editLinkOrAction" | "children">;

export default function CategoryCard(props: Props) {
  const { name, description } = props.category;

  const { t } = useTranslation("app");

  const routingService = useInject<RoutingService>(RoutingService);

  const editLink = useMemo(
    () =>
      routingService.generatePath("categories-edit", { id: props.category.id }),
    []
  );

  return (
    <ResourceCard {...props} editLinkOrAction={editLink}>
      <Typography gutterBottom variant="h5" component="div">
        {name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </ResourceCard>
  );
}
