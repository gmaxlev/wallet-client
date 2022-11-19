import useTitle from "../../meta/useTitle";
import { Alert, Box, Divider, Typography, Container } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function DefaultErrorElement() {
  const { t } = useTranslation();
  useTitle(t("defaultErrorElement.title"));
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Container>
        <Typography
          variant={"h2"}
          component={"h1"}
          fontWeight={"bold"}
          color={"error"}
        >
          {t("defaultErrorElement.header")}
        </Typography>
        <Divider />
        <Alert severity={"error"} sx={{ mt: 3 }}>
          Виникла проблема, але ми вже працюємо над її вирішенням!
        </Alert>
      </Container>
    </Box>
  );
}
