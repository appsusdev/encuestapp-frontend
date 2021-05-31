import { useSelector } from "react-redux";

import {
  Box,
  Typography,
  Grid,
  TextField,
  Tooltip,
  IconButton,
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
import { Gif, PhotoCamera } from "@material-ui/icons";
import AttachFileIcon from "@material-ui/icons/AttachFile";

export const ViewSurvey = () => {
  const classes = useStyles();
  const intl = useIntl();
  const { chapters } = useSelector<AppState, AppState["survey"]>(
    (state) => state.survey
  );
  const list: Chapter[] = chapters;

  return (
    <Box m={2}>
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
                      <PersonIcon />
                    ) : (
                      <HomeIcon />
                    )}
                  </Grid>
                  <Grid item xs={11}>
                    {chapter.number}.{index + 1} {question.question}{" "}
                    <EditOutlinedIcon
                      style={{ marginTop: "0px" }}
                      fontSize="small"
                    />
                  </Grid>

                  <Grid
                    item
                    xs={(question.type === TypeQuestion.TEXT_AREA ||  question.type === TypeQuestion.PICTURE || question.type === TypeQuestion.FILE)? 12 : 8}
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
