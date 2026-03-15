"use client"

import React, { FC } from "react";
import { Modal, Box } from "@mui/material";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: any;
  component: any;
  setRoute?: (route: string) => void;
};

const CustomModal: FC<Props> = ({
  open,
  setOpen,
  activeItem,
  component,
  setRoute,
}) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "420px",
          bgcolor: "background.paper",
          borderRadius: "16px",
          boxShadow: 24,
          p: 4,
          outline: "none",
          "@media (prefers-color-scheme: dark)": {
            bgcolor: "#1e293b",
          },
        }}
      >
        {React.createElement(component, {
          setOpen,
          setRoute,
        })}
      </Box>
    </Modal>
  );
};

export default CustomModal;