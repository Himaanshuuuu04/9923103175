import { Alert, Box, Button } from '@mui/material';

export function ErrorDisplay({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Alert severity="error" action={<Button onClick={onRetry}>Retry</Button>}>
        {message}
      </Alert>
    </Box>
  );
}
