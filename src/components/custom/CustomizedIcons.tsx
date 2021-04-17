import { useIntl } from 'react-intl';
import { IconButton, Tooltip } from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import FormatListNumberedOutlinedIcon from '@material-ui/icons/FormatListNumberedOutlined';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';

interface Icons {
    seeIcon?: true,
    editIcon?: true,
    deleteIcon?: true,
    assignIcon?: true,
    chapterIcon?: true,
    questionIcon?: true,
    onSee?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onAssign?: () => void;
    onChapter?: () => void;
    onQuestion?: () => void;
}

export const CustomizedIcons = (props: Icons) => {
    const { seeIcon, editIcon, deleteIcon, assignIcon, chapterIcon, questionIcon, onSee, onEdit, onDelete, onAssign, onChapter, onQuestion } = props;
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
            {
                (chapterIcon) && (
                    <Tooltip title={`${intl.formatMessage({ id: 'AddChapters' })}`}>
                        <IconButton aria-label="expand row" size="small" onClick={ onChapter }> <FormatListNumberedOutlinedIcon /> </IconButton>
                    </Tooltip>
                )
            }
                        {
                (questionIcon) && (
                    <Tooltip title={`${intl.formatMessage({ id: 'AddQuestions' })}`}>
                        <IconButton aria-label="expand row" size="small" onClick={ onQuestion }> <HelpOutlineOutlinedIcon /></IconButton>
                    </Tooltip>
                )
            }
        </>
    )
}
