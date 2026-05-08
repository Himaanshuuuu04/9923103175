import { Box, CircularProgress, Typography } from '@mui/material';

export function LoadingState() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
      <CircularProgress size={50} sx={{ mb: 2 }} />
      <Typography color="textSecondary">Loading notifications...</Typography>
    </Box>
  );
}
