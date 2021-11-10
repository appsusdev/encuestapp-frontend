import {
  Dialog,
  AppBar,
  IconButton,
  Typography,
  Button,
  CircularProgress,
} from "@material-ui/core";
import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import { FormattedMessage } from "react-intl";
import { TransitionProps } from "@material-ui/core/transitions";
import Slide from "@material-ui/core/Slide";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ReactToPrint from "react-to-print";

const pageStyle = `
@media all {
  .page-break {
    display: none;
  }
}

@media print {
  html, body {
    height: initial !important;
    overflow: initial !important;
    -webkit-print-color-adjust: exact;
  }
}

@media print {
  .page-break {
    margin-top: 1rem;
    display: block;
    page-break-before: auto;
  }
}

@page {
  size: auto;
  margin: 20mm;
}
`;

interface ConfirmationDialogProps {
  width?: boolean;
  textButton?: string;
  open: boolean;
  title: string;
  content: any;
  loading?: boolean;
  onDeny: () => void;
  onConfirm?: () => void;
  titlePDF?: string;
  componentRef?: React.MutableRefObject<HTMLDivElement>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: "relative",
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    btnLoading: {
      color: theme.palette.common.white,
      height: "25px !important",
      width: "25px !important",
    },
  })
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const CustomizedDialogPDF = (props: ConfirmationDialogProps) => {
  const classes = useStyles();
  const {
    open,
    title,
    content,
    onDeny,
    onConfirm,
    textButton,
    loading,
    titlePDF,
    componentRef,
  } = props;
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onDeny}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="close"
            onClick={onDeny}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          {textButton &&
            !loading &&
            (textButton === "Download" && componentRef ? (
              <ReactToPrint
                trigger={() => (
                  <Button autoFocus color="inherit">
                    <FormattedMessage id={`${textButton}`} />
                  </Button>
                )}
                content={() => componentRef.current}
                pageStyle={pageStyle}
                documentTitle={titlePDF}
              />
            ) : (
              <Button autoFocus color="inherit" onClick={onConfirm}>
                <FormattedMessage id={`${textButton}`} />
              </Button>
            ))}
          {loading && (
            <Button color="inherit" autoFocus type="button" disabled={true}>
              <CircularProgress className={classes.btnLoading} />
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {content}
    </Dialog>
  );
};
