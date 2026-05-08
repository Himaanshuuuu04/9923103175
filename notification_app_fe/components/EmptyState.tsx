import { Box, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

export function EmptyState({ message = 'No notifications available' }: { message?: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
      <InfoIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
      <Typography variant="h6" color="textSecondary">
        {message}
      </Typography>
    </Box>
  );
}
