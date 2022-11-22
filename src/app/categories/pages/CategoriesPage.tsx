import { useTranslation } from "react-i18next";
import useTitle from "../../../meta/useTitle";
import { injectFn, useInject } from "../../../ioc/container";
import { Alert, Box, Button, Container, Grid } from "@mui/material";
import ScrollPagination from "../../../components/ScrollPagination/ScrollPagination";
import { useLoaderData } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { PaginatedResponse } from "../../../api/types";
import CategoryDto from "../../../api/resources/category/Category.dto";
import CategoryCard from "../components/CategoryCard";
import { CategoriesService } from "../services/CategoriesService";
import useConfirm from "../../../hooks/useConfirm";
import CategoryDeleteDialog from "../components/CategoryDeleteDialog";
import MuiRouterLink from "../../../router/components/MuiRouterLink";
import { RoutingService } from "../../../router/RoutingService";
import { useLocation } from "react-router";

export const loader = injectFn(
  [CategoriesService],
  (categoriesService: CategoriesService) =>
    (page = 0) =>
      categoriesService.getAll({ page })
);

export default function CategoriesPage() {
  const routingService = useInject<RoutingService>(RoutingService);

  const { t } = useTranslation("app");

  useTitle(t("sections.categories"));

  const confirm = useConfirm<CategoryDto>();

  const location = useLocation();

  const loadedData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const [initialData, setInitialData] = useState<
    PaginatedResponse<CategoryDto[]>
  >(loadedData.data);

  const loadNextPage = useCallback(async (page: number) => {
    return (await loader(page)).data;
  }, []);

  const afterRemove = useCallback(async () => {
    const categories = await loader();
    setInitialData(categories.data);
  }, []);

  const createLink = useMemo(
    () => routingService.generatePath("categories-create"),
    []
  );

  const isShowAdded = useMemo(() => {
    if (location.state?.created?.id === undefined) {
      return false;
    }
    return initialData.data.find(
      (category) => category.id === location.state?.created?.id
    );
  }, [location.state?.created?.id, initialData]);

  return (
    <>
      <CategoryDeleteDialog confirmState={confirm} after={afterRemove} />
      <Container>
        <Box sx={{ textAlign: "center", mb: 5, mt: 3 }}>
          <Button
            variant={"contained"}
            component={MuiRouterLink}
            href={createLink}
          >
            {t("categories.create.title")}
          </Button>
        </Box>
        {isShowAdded && (
          <Alert severity={"success"} sx={{ mb: 3 }}>
            {t("categories.create.success")}
          </Alert>
        )}
        {confirm.isDone && (
          <Alert severity={"success"} sx={{ mb: 3 }}>
            {t("categories.delete.success", { name: confirm.target?.name })}
          </Alert>
        )}
        <Grid container spacing={2} alignItems={"stretch"}>
          <ScrollPagination
            initialData={initialData}
            update={loadNextPage}
            key={confirm.version}
          >
            {(items) =>
              items.map((item, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{
                    display: "flex",
                    wordBreak: "break-word",
                  }}
                  key={index}
                >
                  <CategoryCard
                    isNew={location.state?.created?.id === item.id}
                    category={item}
                    removeLinkOrAction={() => confirm.setTarget(item)}
                  />
                </Grid>
              ))
            }
          </ScrollPagination>
        </Grid>
      </Container>
    </>
  );
}
