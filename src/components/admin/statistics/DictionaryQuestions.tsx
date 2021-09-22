import { FormattedMessage } from "react-intl";
import {
  Box,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Table,
  TableCell,
  TableBody,
  Paper,
  createMuiTheme,
} from "@material-ui/core";
import { useStyles } from "../../../shared/styles/useStyles";

const theme = createMuiTheme({
  typography: {
    fontFamily: "Poppins",
    fontSize: 14,
  },
});

interface Props {
  title: string;
  questions: any[];
}

export const DictionaryQuestions = (props: Props) => {
  const { title, questions } = props;
  const classes = useStyles();

  return (
    <>
      <Box
        mb={4}
        display="flex"
        justifyContent="center"
        className={classes.titlePDF}
      >
        <FormattedMessage id="DictionaryQuestions" />
      </Box>

      <Box mb={4} display="flex">
        <FormattedMessage id="MessagePDF" />
        &nbsp;({title})
      </Box>
      <ThemeProvider theme={theme}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell width="30%">
                  <FormattedMessage id="QuestionCode" />
                </TableCell>
                <TableCell width="70%">
                  <FormattedMessage id="Dictionary" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions &&
                questions.map((question: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{question.question}</TableCell>
                    <TableCell>{question.answer}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ThemeProvider>
    </>
  );
};
