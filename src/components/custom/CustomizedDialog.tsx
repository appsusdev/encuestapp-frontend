import React from 'react';
import clsx from 'clsx';

import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Fonts } from '../../shared/constants/AppEnums';
import { FormattedMessage } from 'react-intl';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            padding: theme.spacing(2),
            fontFamily: 'Poppins',
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
        btn: {
            width: '20%',
            height: '100%',
            fontWeight: Fonts.REGULAR,
            textTransform: 'capitalize',
            color: 'white',
            fontSize: 14,
            paddingTop: 12,
            paddingBottom: 12,
            borderRadius: '4px'
        },
        cancel: {
            position: 'absolute',
            height: '70%',
            left: '15px',
            background: '#F04F47',
            '&:hover': {
                background: '#D94040'
            },
        },
        save: {
            position: 'absolute',
            height: '70%',
            right: '15px',
            background: '#0A8FDC',
            '&:hover': {
                background: '#0A6DDC'
            }
        },
        title: {
            fontFamily: 'Poppins',
            fontSize: 18,
            fontWeight: Fonts.MEDIUM,
            color: theme.palette.grey[800]
        },
    });

export interface DialogTitleProps extends WithStyles<typeof styles> {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography className={classes.title} variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),
        fontFamily: 'Poppins'
    },}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
        height: '60px',
        position: 'relative',
    },
}))(MuiDialogActions);

interface ConfirmationDialogProps extends WithStyles<typeof styles> {
    open: boolean;
    title: string;
    content: any;
    cancelBtn: boolean;
    seeActions?: true;
    onDeny: (x: boolean) => void;
    onConfirm?: () => void;
}

export const CustomizedDialog = withStyles(styles)((props: ConfirmationDialogProps) => {
    const { open, title, content, cancelBtn, seeActions, onDeny, onConfirm, classes } = props;

    return (
        <>
            <Dialog maxWidth="md" fullWidth onClose={() => onDeny(false)} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={() => onDeny(false)}>
                    {title}
                </DialogTitle>
                <DialogContent dividers>
                    {content}
                </DialogContent>
                {
                    (seeActions) &&
                    <DialogActions>
                        {
                            (cancelBtn) &&
                            <Button className={clsx(classes.btn, classes.cancel)} onClick={() => onDeny(false)}>
                                <FormattedMessage id="Cancel" />
                            </Button>
                        }
                        <Button className={clsx(classes.btn, classes.save)} autoFocus onClick={onConfirm}>
                            <FormattedMessage id="Save" />
                        </Button>
                    </DialogActions>
                }
            </Dialog>
        </>
    );
});

export default CustomizedDialog;