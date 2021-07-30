import clsx from "clsx";
import { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Button,
  Typography,
  Grid,
  MenuItem,
  TextField,
  Tooltip,
  IconButton,
  Checkbox,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import { grey, red } from "@material-ui/core/colors";
import { PhotoCamera } from "@material-ui/icons";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import HomeIcon from "@material-ui/icons/Home";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import PersonIcon from "@material-ui/icons/Person";
import { Alert } from "@material-ui/lab";
import { AppState } from "../../../redux/reducers/rootReducer";
import { Chapter, SurveyQuestion, Survey } from "../../../interfaces/Survey";
import { useStyles } from "../../../shared/styles/useStyles";
import { TypeQuestion } from "../../../enums/enums";
import {
  uiOpenQuestion,
  uiCloseQuestion,
} from "../../../redux/actions/uiActions";
import { FormAddQuestion } from "./FormAddQuestion";
import CustomizedDialog from "../../custom/CustomizedDialog";
import { startDeleteQuestion } from '../../../redux/actions/surveysActions';
import {
  questionActive,
  questionCleanActive,
  chapterQuestionActive,
  chapterQuestionCleanActive,
  startLoadingChapters
} from "../../../redux/actions/surveysActions";

export const ViewSurvey = () => {
  const classes = useStyles();
  const intl = useIntl();
  const dispatch = useDispatch();
  const { chapters, activeSurvey } = useSelector<AppState, AppState["survey"]>(
    (state) => state.survey
  );
  const { municipio } = useSelector<AppState, AppState["auth"]>(
    (state) => state.auth
  );
  const { openQuestion } = useSelector<AppState, AppState["ui"]>(
    (state) => state.ui
  );
  const list: Chapter[] = chapters;
  const survey: Survey = activeSurvey;

  useEffect(() => {
    municipio &&
      dispatch(startLoadingChapters(municipio, survey.idSurvey));
      // eslint-disable-next-line
  }, [dispatch, municipio]);

  const editQuestion = (
    question: SurveyQuestion,
    idChapter: string,
    nameChapter: string
  ) => {
    dispatch(chapterQuestionActive({ id: idChapter, name: nameChapter }));
    dispatch(questionActive(question));
    dispatch(uiOpenQuestion());
  };

  const deleteQuestion = (question: SurveyQuestion, idChapter: string) => {
    console.log(idChapter)
    dispatch( startDeleteQuestion(question, idChapter) );
  };

  const handleClose = () => {
    dispatch(chapterQuestionCleanActive());
    dispatch(questionCleanActive());
    dispatch(uiCloseQuestion());
  };

  return (
    <Box m={2} className={classes.typography}>
      {list.length === 0 ? (
        <Alert severity="info" color="info">
          <FormattedMessage id="EmptySurvey" />
        </Alert>
      ) : (
        list.map((chapter) => (
          <div key={chapter.id}>
            <Typography className={classes.title} variant="h6">
              {chapter.number}. {chapter.name}
            </Typography>

            {chapter.questions.map((question, index) => (
              <Box m={1} mb={1} key={question.id}>
                <Grid container>
                  <Grid item xs={1}>
                    {question.directedTo === "PreguntasIndividual" ? (
                      <PersonIcon
                        fontSize="small"
                        style={{ marginTop: "2px" }}
                      />
                    ) : (
                      <HomeIcon fontSize="small" style={{ marginTop: "2px" }} />
                    )}
                  </Grid>
                  <Grid item xs={11} style={{ marginLeft: "-10px" }}>
                    {chapter.number}.{index + 1} {question.question}
                    <Tooltip
                      title={`${intl.formatMessage({ id: "Edit" })}`}
                      style={{
                        marginLeft: "5px",
                        marginTop: "-5px",
                        color: grey[800],
                      }}
                      color="default"
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          editQuestion(question, chapter.id, chapter.name)
                        }
                      >
                        <EditOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={`${intl.formatMessage({ id: "Delete" })}`}
                      style={{ marginTop: "-5px", color: red[600] }}
                      color="secondary"
                    >
                      <IconButton
                        size="small"
                        onClick={() => deleteQuestion(question, chapter.id)}
                      >
                        <DeleteOutlineOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>

                  <Grid
                    item
                    xs={
                      question.type === TypeQuestion.TEXT_AREA ||
                      question.type === TypeQuestion.PICTURE ||
                      question.type === TypeQuestion.FILE
                        ? 12
                        : 8
                    }
                  >
                    {(question.type === TypeQuestion.TEXT_INPUT ||
                      question.type === TypeQuestion.NUMBER) && (
                      <TextField
                        name="input"
                        variant="outlined"
                        className={classes.myTextFieldRoot}
                        size="small"
                        disabled={true}
                      />
                    )}
                    {question.type === TypeQuestion.TEXT_AREA && (
                      <TextField
                        name="input"
                        variant="outlined"
                        className={classes.myTextFieldRoot}
                        multiline
                        rows={3}
                        disabled={true}
                      />
                    )}
                    {question.type === TypeQuestion.DATE && (
                      <TextField
                        name="date"
                        variant="outlined"
                        className={classes.myTextFieldRoot}
                        type="date"
                        size="small"
                      />
                    )}
                    {question.type === TypeQuestion.DEPARTMENT && (
                      <TextField
                        size="small"
                        name="deparment"
                        value=""
                        variant="outlined"
                        label={`${intl.formatMessage({ id: "Department" })}`}
                        InputLabelProps={{ shrink: false }}
                        select
                        className={classes.myTextFieldRoot}
                      >
                        <MenuItem key={index} value=""></MenuItem>
                      </TextField>
                    )}
                    {question.type === TypeQuestion.TOWN && (
                      <>
                        <label
                          className="form-text"
                          style={{ fontSize: "11px" }}
                        >
                          <FormattedMessage id="FilterTownMessage" />
                        </label>
                        <TextField
                          size="small"
                          name="deparment"
                          value=""
                          variant="outlined"
                          label={`${intl.formatMessage({ id: "Department" })}`}
                          InputLabelProps={{ shrink: false }}
                          select
                          className={classes.myTextFieldRoot}
                        >
                          <MenuItem key={index} value=""></MenuItem>
                        </TextField>
                        <TextField
                          size="small"
                          name="town"
                          value=""
                          variant="outlined"
                          label={`${intl.formatMessage({ id: "Town" })}`}
                          InputLabelProps={{ shrink: false }}
                          select
                          className={classes.myTextFieldRoot}
                        >
                          <MenuItem key={index} value=""></MenuItem>
                        </TextField>
                      </>
                    )}
                    {(question.type === TypeQuestion.FILE ||
                      question.type === TypeQuestion.PICTURE) && (
                      <>
                        <Grid container>
                          <Grid item xs={8}>
                            <TextField
                              type="file"
                              id="icon-button-file"
                              style={{ display: "none" }}
                            />
                            <TextField
                              disabled={true}
                              variant="outlined"
                              name="hola"
                              size="small"
                              className={classes.myTextFieldRoot}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <Tooltip
                              title={`${intl.formatMessage({ id: "Attach" })}`}
                            >
                              <label htmlFor="icon-button-file">
                                <IconButton component="span">
                                  {question.type === TypeQuestion.PICTURE ? (
                                    <PhotoCamera />
                                  ) : (
                                    <AttachFileIcon />
                                  )}
                                </IconButton>
                              </label>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </>
                    )}
                    {question.options &&
                      question.type !== TypeQuestion.SELECT &&
                      question.options.map((option, index) => (
                        <Grid container key={index}>
                          <Grid item xs={6}>
                            {question.type === TypeQuestion.RADIO && (
                              <FormControlLabel
                                value={option.label}
                                control={<Radio />}
                                label={option.label}
                              />
                            )}
                            {question.type === TypeQuestion.CHECK && (
                              <>
                                <Checkbox color="default" />
                                <label className="form-text">
                                  {option.label}
                                </label>
                              </>
                            )}
                          </Grid>
                        </Grid>
                      ))}
                    {question.type === TypeQuestion.SELECT && (
                      <TextField
                        size="small"
                        name="question"
                        value=""
                        variant="outlined"
                        label={`${intl.formatMessage({ id: "InputSelect" })}`}
                        InputLabelProps={{ shrink: false }}
                        select
                        className={classes.myTextFieldRoot}
                      >
                        {question.options?.map((option, index) => (
                          <MenuItem key={index} value={option.label}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                    {question.type === TypeQuestion.GEOLOCATION && (
                      <Button
                        style={{
                          marginTop: "10px",
                          textTransform: "uppercase",
                        }}
                        className={clsx(classes.btnAction, classes.save)}
                        size="medium"
                        component="span"
                      >
                        <LocationOnIcon />
                        <FormattedMessage id="GetPosition" />
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Box>
            ))}
          </div>
        ))
      )}

      <CustomizedDialog
        open={openQuestion}
        onDeny={handleClose}
        cancelBtn={true}
        title={`${intl.formatMessage({ id: "EditQuestion" })}`}
        content={<FormAddQuestion />}
        textButton="Accept"
      />
    </Box>
  );
};
