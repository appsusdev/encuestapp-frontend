import { useIntl } from 'react-intl';
import { Tooltip } from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import IconButton from '@material-ui/core/IconButton';

interface Icons {
    seeIcon?: true,
    editIcon?: true,
    deleteIcon?: true,
    assignIcon?: true,
    onSee?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onAssign?: () => void;
}

export const CustomizedIcons = (props: Icons) => {
    const { seeIcon, editIcon, deleteIcon, assignIcon, onSee, onEdit, onDelete, onAssign } = props;
    const intl = useIntl();

    return (
        <>
            {
                (seeIcon) && (
                    <Tooltip title={`${intl.formatMessage({ id: 'See' })}`}>
                        <IconButton aria-label="expand row" size="small" onClick={ onSee }> <VisibilityOutlinedIcon /> </IconButton>
                    </Tooltip>
                )
            }
            {
                (editIcon) && (
                    <Tooltip title={`${intl.formatMessage({ id: 'Edit' })}`}>
                        <IconButton aria-label="expand row" size="small" onClick={ onEdit }> <EditOutlinedIcon /> </IconButton>
                    </Tooltip>
                )
            }
            {
                (deleteIcon) && (
                    <Tooltip title={`${intl.formatMessage({ id: 'Delete' })}`}>
                        <IconButton aria-label="expand row" size="small" onClick={ onDelete }> <DeleteOutlineOutlinedIcon /> </IconButton>
                    </Tooltip>
                )
            }
            {
                (assignIcon) && (
                    <Tooltip title={`${intl.formatMessage({ id: 'AssignSurveys' })}`}>
                        <IconButton aria-label="expand row" size="small" onClick={ onAssign }> <DescriptionOutlinedIcon /> </IconButton>
                    </Tooltip>
                )
            }
        </>
    )
}
