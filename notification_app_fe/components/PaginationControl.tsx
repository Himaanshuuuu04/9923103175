import { Box, Pagination } from '@mui/material';

interface PaginationProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
}

export function PaginationControl({ page, total, onChange }: PaginationProps) {
  if (total <= 1) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
      <Pagination count={total} page={page} onChange={(_, p) => onChange(p)} color="primary" />
    </Box>
  );
}
