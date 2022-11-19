import useTitle from "../../meta/useTitle";
import { Container } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function AppHomePage() {
  const { t } = useTranslation("app");
  useTitle(t("sections.overview"));
  return <Container>{t("sections.overview")}</Container>;
}
