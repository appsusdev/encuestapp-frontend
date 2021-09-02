import React from "react";
import clsx from "clsx";

import { Theme, withStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  IconButton,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import CloseIcon from "@material-ui/icons/Close";
import { FormattedMessage } from "react-intl";
import { useStyles } from "../../shared/styles/useStyles";
import { makeStyles } from "@material-ui/core";

const styles = makeStyles(() => ({
  cancel: {
    position: "absolute",
    height: "70%",
    left: "15px",
  },
  save: {
    position: "absolute",
    height: "70%",
    right: "15px",
  },
}));

export interface DialogTitleProps {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = (props: DialogTitleProps) => {
  const classes = useStyles();
  const { children, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography className={classes.title} variant="h6">
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
    fontFamily: "Poppins",
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
    height: "60px",
    position: "relative",
  },
}))(MuiDialogActions);

interface ConfirmationDialogProps {
  width?: boolean;
  textButton?: string;
  open: boolean;
  title: string;
  content: any;
  cancelBtn: boolean;
  seeActions?: true;
  loading?: boolean;
  onDeny: (x: boolean) => void;
  onConfirm?: () => void;
}

export const CustomizedDialog = (props: ConfirmationDialogProps) => {
  const classes = useStyles();
  const btn = styles();
  const {
    open,
    title,
    content,
    cancelBtn,
    seeActions,
    onDeny,
    onConfirm,
    width,
    textButton,
    loading,
  } = props;

  return (
    <>
      {width ? (
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="md"
          fullWidth
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogTitle
            id="customized-dialog-title"
            onClose={() => onDeny(false)}
          >
            {title}
          </DialogTitle>
          <DialogContent dividers>{content}</DialogContent>
          {seeActions && (
            <DialogActions>
              {cancelBtn && (
                <Button
                  className={clsx(classes.btn, classes.cancel, btn.cancel)}
                  onClick={() => onDeny(false)}
                >
                  <FormattedMessage id="Cancel" />
                </Button>
              )}
              <Button
                className={clsx(classes.btn, classes.save, btn.save)}
                autoFocus
                onClick={onConfirm}
              >
                <FormattedMessage id="Save" />
              </Button>
            </DialogActions>
          )}
        </Dialog>
      ) : (
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="sm"
          fullWidth
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogTitle
            id="customized-dialog-title"
            onClose={() => onDeny(false)}
          >
            {title}
          </DialogTitle>
          <DialogContent dividers>{content}</DialogContent>
          {seeActions && (
            <DialogActions>
              {cancelBtn && (
                <Button
                  className={clsx(classes.btn, classes.cancel, btn.cancel)}
                  onClick={() => onDeny(false)}
                >
                  <FormattedMessage id="Cancel" />
                </Button>
              )}
              {textButton && !loading ? (
                <Button
                  className={clsx(classes.btn, classes.save, btn.save)}
                  autoFocus
                  onClick={onConfirm}
                >
                  <FormattedMessage id={`${textButton}`} />
                </Button>
              ) : (
                <Button
                  className={clsx(classes.btn, classes.save, btn.save)}
                  autoFocus
                  onClick={onConfirm}
                >
                  <FormattedMessage id="Save" />
                </Button>
              )}
              {loading && (
                <Button
                  className={clsx(classes.btn, classes.save, btn.save)}
                  autoFocus
                  type="button"
                  disabled={true}
                >
                  <CircularProgress className={classes.btnLoading} />
                </Button>
              )}
            </DialogActions>
          )}
        </Dialog>
      )}
    </>
  );
};

export default CustomizedDialog;
