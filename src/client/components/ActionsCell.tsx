import { styled } from "@mui/material";

const ActionsCell = styled("div")<{ align?: "left" | "center" | "right" }>(
  ({ theme, align = "right" }) => ({
    height: "100%",
    display: "flex",
    justifyContent: {
      left: "flex-start",
      center: "center",
      right: "flex-end",
    }[align],
    alignItems: "center",
    gap: theme.spacing(1),
  })
);

export default ActionsCell;
