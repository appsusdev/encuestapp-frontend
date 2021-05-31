import { useSelector } from "react-redux";

import {
  Box,
  Typography,
  Grid,
  TextField,
  Tooltip,
  IconButton,
  Checkbox,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { AppState } from "../../../redux/reducers/rootReducer";
import { Chapter } from "../../../interfaces/Survey";
import { FormattedMessage, useIntl } from "react-intl";
import { useStyles } from "../../../shared/styles/useStyles";
import PersonIcon from "@material-ui/icons/Person";
import HomeIcon from "@material-ui/icons/Home";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { TypeQuestion } from "../../../enums/enums";
import { PhotoCamera } from "@material-ui/icons";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { MenuItem } from "@material-ui/core";

export const ViewSurvey = () => {
  const classes = useStyles();
  const intl = useIntl();
  const { chapters } = useSelector<AppState, AppState["survey"]>(
    (state) => state.survey
  );
  const list: Chapter[] = chapters;

  const editQuestion = (idQuestion: string) => {
    // console.log(idQuestion);
  }

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
                        style={{ marginTop: "5px" }}
                      />
                    ) : (
                      <HomeIcon fontSize="small" style={{ marginTop: "5px" }} />
                    )}
                  </Grid>
                  <Grid item xs={11} style={{ marginLeft: "-10px" }}>
                    {chapter.number}.{index + 1} {question.question}
                    <EditOutlinedIcon
                      onClick={ () => editQuestion(question.id)}
                      style={{ marginLeft: '10px' }}
                      fontSize="small"
                    />
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
                    {(question.options && question.type !== TypeQuestion.SELECT) &&
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
                        label={`${intl.formatMessage({id: "InputSelect"})}`}
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
                  </Grid>
                </Grid>
              </Box>
            ))}
          </div>
        ))
      )}
    </Box>
  );
};
