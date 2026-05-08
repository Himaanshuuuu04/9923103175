import { Box, Typography, useTheme, Paper, Stack } from '@mui/material';
import { Notification } from '@/lib/types';
import { NotificationCard } from './NotificationCard';

export function PriorityNotificationsSection({ notifications }: { notifications: Notification[] }) {
  const theme = useTheme();
  if (!notifications || notifications.length === 0) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 4,
        p: { xs: 2, md: 2.5 },
        borderRadius: 4,
        background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.08), rgba(59, 130, 246, 0.04))',
        border: '1px solid rgba(37, 99, 235, 0.10)',
      }}
    >
      <Stack spacing={0.75} sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 800, letterSpacing: -0.2 }}>
          ⭐ Top Priority
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Important notifications surfaced first, so nothing critical gets lost.
        </Typography>
      </Stack>

      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, scrollSnapType: 'x mandatory' }}>
        {notifications.map((n) => (
          <Box key={n.id} sx={{ minWidth: { xs: 280, md: 340 }, flex: '0 0 auto', scrollSnapAlign: 'start' }}>
            <NotificationCard notification={n} />
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
