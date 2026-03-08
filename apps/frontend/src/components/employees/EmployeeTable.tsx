import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TableSortLabel, TablePagination,
  IconButton, Tooltip, Skeleton, Chip, alpha,
} from '@mui/material'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EmployeeAvatar from './EmployeeAvatar'
import StatusChip from '@/components/common/StatusChip'
import type { Employee } from '@/types'
import { format } from 'date-fns'

interface EmployeeTableProps {
  employees: Employee[]
  total: number
  page: number
  pageSize: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onSort: (field: string) => void
  onView: (id: number) => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  loading?: boolean
}

const COLUMNS = [
  { id: 'name', label: 'Employee', sortable: true, width: '28%' },
  { id: 'department', label: 'Department', sortable: true, width: '14%' },
  { id: 'designation', label: 'Role', sortable: false, width: '14%' },
  { id: 'salary', label: 'Salary', sortable: true, width: '10%' },
  { id: 'joiningDate', label: 'Joined', sortable: true, width: '10%' },
  { id: 'skills', label: 'Skills', sortable: false, width: '16%' },
  { id: 'isActive', label: 'Status', sortable: true, width: '8%' },
  { id: 'actions', label: '', sortable: false, width: '8%' },
]

function SkeletonRows() {
  return (
    <>
      {[...Array(8)].map((_, i) => (
        <TableRow key={i}>
          <TableCell><Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}><Skeleton variant="circular" width={40} height={40} /><Box><Skeleton width={120} height={14} /><Skeleton width={160} height={12} sx={{ mt: 0.5 }} /></Box></Box></TableCell>
          {[...Array(6)].map((_, j) => (
            <TableCell key={j}><Skeleton height={14} /></TableCell>
          ))}
          <TableCell><Skeleton height={14} /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default function EmployeeTable({
  employees, total, page, pageSize,
  sortBy, sortOrder, onPageChange, onPageSizeChange,
  onSort, onView, onEdit, onDelete, loading,
}: EmployeeTableProps) {
  return (
    <Box>
      <TableContainer
        sx={{
          borderRadius: '12px 12px 0 0',
          border: '1px solid rgba(148,163,184,0.08)',
          borderBottom: 'none',
          overflow: 'hidden',
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {COLUMNS.map((col) => (
                <TableCell
                  key={col.id}
                  sx={{ width: col.width, py: 1.5, px: 2 }}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={sortBy === col.id}
                      direction={sortBy === col.id ? sortOrder : 'asc'}
                      onClick={() => onSort(col.id)}
                      sx={{
                        color: '#475569 !important',
                        '& .MuiTableSortLabel-icon': { color: '#475569 !important', fontSize: 14 },
                        '&.Mui-active': { color: '#6C8EFF !important' },
                        '&.Mui-active .MuiTableSortLabel-icon': { color: '#6C8EFF !important' },
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
                      }}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <SkeletonRows />
            ) : employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: 'center', py: 6, color: '#475569', border: 'none' }}>
                  No employees found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <TableRow
                  key={emp.id}
                  hover
                  sx={{
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    '&:hover': { background: alpha('#6C8EFF', 0.04) },
                    '&:hover .row-actions': { opacity: 1 },
                    '& td': { py: 1.4, px: 2 },
                  }}
                  onClick={() => onView(emp.id)}
                >
                  {/* Employee */}
                  <TableCell>
                    <EmployeeAvatar
                      firstName={emp.firstName}
                      lastName={emp.lastName}
                      email={emp.email}
                      avatarUrl={emp.avatarUrl}
                    />
                  </TableCell>

                  {/* Department */}
                  <TableCell>
                    <Chip
                      label={emp.department.name}
                      size="small"
                      sx={{
                        height: 20, fontSize: '0.7rem', fontWeight: 600,
                        background: alpha('#FF8C6B', 0.1), color: '#FF8C6B',
                        border: '1px solid rgba(255,140,107,0.2)',
                        '& .MuiChip-label': { px: 0.8 },
                      }}
                    />
                  </TableCell>

                  {/* Designation */}
                  <TableCell sx={{ color: '#94A3B8', fontSize: '0.82rem' }}>
                    {emp.designation.name}
                  </TableCell>

                  {/* Salary */}
                  <TableCell>
                    <Box sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8rem', color: '#4ADE80', fontWeight: 600 }}>
                      ${emp.salary.toLocaleString()}
                    </Box>
                  </TableCell>

                  {/* Joined */}
                  <TableCell sx={{ color: '#64748B', fontSize: '0.78rem', fontFamily: '"JetBrains Mono", monospace' }}>
                    {format(new Date(emp.joiningDate), 'MMM d, yyyy')}
                  </TableCell>

                  {/* Skills */}
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {emp.skills.slice(0, 2).map((s) => (
                        <Chip
                          key={s}
                          label={s}
                          size="small"
                          sx={{
                            height: 18, fontSize: '0.62rem', fontWeight: 600,
                            background: alpha('#6C8EFF', 0.08), color: '#6C8EFF',
                            '& .MuiChip-label': { px: 0.6 },
                          }}
                        />
                      ))}
                      {emp.skills.length > 2 && (
                        <Chip
                          label={`+${emp.skills.length - 2}`}
                          size="small"
                          sx={{
                            height: 18, fontSize: '0.62rem',
                            background: 'rgba(148,163,184,0.08)', color: '#64748B',
                            '& .MuiChip-label': { px: 0.6 },
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <StatusChip status={emp.isActive ? 'active' : 'inactive'} />
                  </TableCell>

                  {/* Actions */}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Box
                      className="row-actions"
                      sx={{
                        display: 'flex', gap: 0.3,
                        opacity: 0, transition: 'opacity 0.15s',
                      }}
                    >
                      <Tooltip title="View" arrow>
                        <IconButton size="small" onClick={() => onView(emp.id)} sx={{ color: '#475569', '&:hover': { color: '#6C8EFF' } }}>
                          <VisibilityRoundedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit" arrow>
                        <IconButton size="small" onClick={() => onEdit(emp.id)} sx={{ color: '#475569', '&:hover': { color: '#FACC15' } }}>
                          <EditRoundedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <IconButton size="small" onClick={() => onDelete(emp.id)} sx={{ color: '#475569', '&:hover': { color: '#F87171' } }}>
                          <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        rowsPerPage={pageSize}
        onPageChange={(_, p) => onPageChange(p + 1)}
        onRowsPerPageChange={(e) => onPageSizeChange(Number(e.target.value))}
        rowsPerPageOptions={[10, 25, 50]}
        sx={{
          border: '1px solid rgba(148,163,184,0.08)',
          borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          background: '#0D1525',
          color: '#64748B',
          '& .MuiTablePagination-toolbar': { minHeight: 48 },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: '0.78rem', fontFamily: '"JetBrains Mono", monospace',
          },
          '& .MuiSelect-select': { fontSize: '0.78rem' },
          '& .MuiIconButton-root': { color: '#64748B', '&:hover': { color: '#94A3B8' } },
          '& .Mui-disabled': { color: '#1E293B !important' },
        }}
      />
    </Box>
  )
}
