import { Box } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: any;
    value: any;
  }

export const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (

<Box >
{children}
</Box>
      )}
    </div>
  );
}

export const a11yProps = (index: any) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    height: 'auto',
  },
  tabs: {  
      color: '#212529',
      backgroundColor: 'white',
      indicatorColor: '#33b35a', 
      
  },
  tab: {
    textTransform: 'none',
    fontFamily: [
      'Poppins',
    ].join(','),
    '&:hover': {
      color: '#0A8FDC',
      opacity: 1,
      borderColor: 'primary'
    },
    '&:focus': {
      color: '#0A8FDC',
    },
  }
}));