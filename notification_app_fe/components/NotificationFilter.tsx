import { Box, Tabs, Tab } from '@mui/material';

interface FilterProps {
  value: string;
  onChange: (filter: string) => void;
}

export function NotificationFilter({ value, onChange }: FilterProps) {
  return (
    <Box sx={{ mb: 3, borderBottom: '1px solid #e6e6e6' }}>
      <Tabs
        value={value}
        onChange={(_, v) => onChange(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ '& .MuiTabs-indicator': { height: 3, backgroundColor: 'primary.main' } }}
      >
        <Tab label="All" value="All" />
        <Tab label="Placement" value="Placement" />
        <Tab label="Result" value="Result" />
        <Tab label="Event" value="Event" />
      </Tabs>
    </Box>
  );
}
