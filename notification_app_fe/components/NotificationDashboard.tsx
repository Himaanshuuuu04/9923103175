'use client';

import { useEffect, useState } from 'react';
import {
  AppBar,
  Badge,
  Box,
  Chip,
  Container,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { fetchNotifications } from '@/lib/api';
import { Notification } from '@/lib/types';
import { getPriorityNotifications } from '@/lib/utils';
import { EmptyState } from './EmptyState';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingState } from './LoadingState';
import { NotificationCard } from './NotificationCard';
import { NotificationFilter } from './NotificationFilter';
import { PaginationControl } from './PaginationControl';
import { PriorityNotificationsSection } from './PriorityNotificationsSection';

export function NotificationDashboard() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [priority, setPriority] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [filter, setFilter] = useState('All');

  const load = async (pageNum: number, filterType: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchNotifications(pageNum, 10, filterType);
      const list = res?.data ?? [];
      setNotifications(list);
      setPriority(getPriorityNotifications(list));
      setTotal(res?.total_pages ?? 1);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1, 'All');
  }, []);

  const handleFilterChange = (value: string) => {
    setFilter(value);
    load(1, value);
  };

  const handlePageChange = (value: number) => {
    load(value, filter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const unread = notifications.filter((n) => !n.read).length + priority.filter((n) => !n.read).length;
  const totalCount = notifications.length;
  const readCount = totalCount - notifications.filter((n) => !n.read).length;

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f6f8fc 0%, #eef3f9 100%)' }}>
      <AppBar position="sticky" elevation={0} sx={{ background: 'rgba(12, 25, 51, 0.92)', backdropFilter: 'blur(12px)' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 1.2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Badge badgeContent={unread} color="error" overlap="circular">
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,0.12)' }}>
                <NotificationsIcon sx={{ color: '#fff' }} />
              </Box>
            </Badge>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                Notifications
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.75 }}>
                Calm, prioritized, easy to scan
              </Typography>
            </Box>
          </Box>
          <Chip
            icon={<FiberManualRecordRoundedIcon sx={{ fontSize: 14 }} />}
            label={`Page ${page} of ${total}`}
            size="small"
            sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.12)', '& .MuiChip-icon': { color: '#7dd3fc' } }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,255,255,0.72))',
            border: '1px solid rgba(15, 23, 42, 0.06)',
            boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
          }}
        >
          <Stack spacing={1.2}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
              <Chip icon={<TrendingUpRoundedIcon sx={{ fontSize: 16 }} />} label="Live notification feed" color="primary" variant="outlined" />
              <Chip label={`${unread} unread`} size="small" sx={{ bgcolor: 'rgba(239, 68, 68, 0.08)', color: '#b91c1c' }} />
              <Chip label={`${readCount} read`} size="small" sx={{ bgcolor: 'rgba(34, 197, 94, 0.08)', color: '#15803d' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
              Elegant Notification Center
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 760 }}>
              A clean, responsive space for browsing priority alerts, reading updates, and moving through pages without visual noise.
            </Typography>
          </Stack>
        </Paper>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
          {[
            { label: 'Total', value: totalCount },
            { label: 'Unread', value: unread },
            { label: 'Priority', value: priority.length },
          ].map((item) => (
            <Paper key={item.label} elevation={0} sx={{ p: 2.2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.75)', border: '1px solid rgba(15, 23, 42, 0.06)' }}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1.1 }}>
                {item.label}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                {item.value}
              </Typography>
            </Paper>
          ))}
        </Box>

        {error && <ErrorDisplay message={error} onRetry={() => load(page, filter)} />}

        {!loading && <NotificationFilter value={filter} onChange={handleFilterChange} />}

        {loading && <LoadingState />}

        {!loading && !error && notifications.length === 0 && (
          <EmptyState message={filter !== 'All' ? `No ${filter} notifications` : 'No notifications'} />
        )}

        {!loading && !error && notifications.length > 0 && (
          <>
            {filter === 'All' && <PriorityNotificationsSection notifications={priority} />}
            <Box>
              {notifications.map((n) => (
                <NotificationCard key={n.id} notification={n} />
              ))}
            </Box>
            <PaginationControl page={page} total={total} onChange={handlePageChange} />
          </>
        )}
      </Container>
    </Box>
  );
}
