import { injectFn, useInject } from "../../../ioc/container";
import { RouteContext } from "../../../router/types";
import { isAxiosError } from "../../../api/utils";
import { ResourceNotFoundException } from "../../../exeptions/ResourceNotFoundException";
import { CategoriesService } from "../services/CategoriesService";
import { useLoaderData } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useTitle from "../../../meta/useTitle";
import { RoutingService } from "../../../router/RoutingService";
import React, { useMemo } from "react";
import { Container, Grid } from "@mui/material";
import CustomBreadcrumbs from "../../../components/CustomBreadcrumbs/CustomBreadcrumbs";
import ResourceNotFound from "../../../components/ResourceNotFound/ResourceNotFound";
import CategoryIcon from "@mui/icons-material/Category";
import CategoryEditControl from "../components/CategoryEditControl";

export const loader = injectFn(
  [CategoriesService],
  (categoriesService: CategoriesService) => (context: RouteContext) => {
    return categoriesService
      .get(Number(context.args.params?.id))
      .catch((error) => {
        if (isAxiosError([404, 403], error)) {
          return new ResourceNotFoundException();
        }
        return Promise.reject(error);
      });
  }
);

export default function CategoriesEditPage() {
  const category = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { t } = useTranslation("app");

  const isNotFound = category instanceof ResourceNotFoundException;

  useTitle(
    t(isNotFound ? "categories.notFound.title" : "categories.update.title")
  );

  const routingService = useInject<RoutingService>(RoutingService);

  const breadcrumbs = useMemo(
    () => [
      {
        to: routingService.generatePath("categories"),
        text: t("sections.categories"),
        Icon: CategoryIcon,
      },
    ],
    [routingService, t]
  );

  return (
    <Container>
      <Grid container justifyContent={"center"}>
        <Grid xs={12} md={10} xl={8} item>
          <CustomBreadcrumbs
            chain={breadcrumbs}
            current={t("categories.update.title")}
          />
          {isNotFound ? (
            <ResourceNotFound>
              {t("categories.notFound.details")}
            </ResourceNotFound>
          ) : (
            <CategoryEditControl category={category.data} />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
