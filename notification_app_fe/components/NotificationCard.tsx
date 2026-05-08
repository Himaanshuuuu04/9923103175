import { Card, CardContent, Typography, Chip, Box, useTheme, Avatar, Grid } from '@mui/material';
import { Notification } from '@/lib/types';
import { formatDate, getTypeColor } from '@/lib/utils';

function initials(type: string) {
  return type?.[0] || 'N';
}

export function NotificationCard({ notification }: { notification: Notification }) {
  const theme = useTheme();
  const color = getTypeColor(notification.notification_type) as any;

  return (
    <Card
      elevation={0}
      sx={{
        mb: 2,
        borderRadius: 3,
        overflow: 'hidden',
        borderLeft: notification.read ? 'none' : `4px solid ${theme.palette.primary.main}`,
        background: notification.read
          ? 'rgba(255,255,255,0.82)'
          : 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))',
        border: '1px solid rgba(15, 23, 42, 0.06)',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 18px 45px rgba(15, 23, 42, 0.10)',
        },
      }}
    >
      <CardContent sx={{ py: 2.25, px: { xs: 2, md: 2.5 } }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              sx={{
                bgcolor: theme.palette[color]?.main || theme.palette.primary.main,
                boxShadow: '0 8px 20px rgba(15,23,42,0.12)',
                fontWeight: 700,
              }}
            >
              {initials(notification.notification_type)}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.8, flexWrap: 'wrap' }}>
              <Chip label={notification.notification_type} color={color} size="small" variant={notification.read ? 'outlined' : 'filled'} />
              {!notification.read && <Chip label="New" size="small" color="primary" />}
            </Box>
            <Typography variant="body1" sx={{ fontWeight: notification.read ? 400 : 650, lineHeight: 1.6, color: 'text.primary' }}>
              {notification.message}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
              {formatDate(notification.timestamp)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
