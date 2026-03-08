import {
  Box, TextField, Select, MenuItem, FormControl, InputLabel,
  Button, ToggleButtonGroup, ToggleButton, InputAdornment,
  Typography, Chip, alpha,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded'
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import type { Department } from '@/types'

export type ViewMode = 'table' | 'grid'

interface EmployeeToolbarProps {
  search: string
  onSearchChange: (v: string) => void
  departmentId: number | ''
  onDepartmentChange: (v: number | '') => void
  isActive: boolean | ''
  onIsActiveChange: (v: boolean | '') => void
  departments: Department[]
  viewMode: ViewMode
  onViewModeChange: (v: ViewMode) => void
  total: number
  onAddNew: () => void
}

export default function EmployeeToolbar({
  search, onSearchChange,
  departmentId, onDepartmentChange,
  isActive, onIsActiveChange,
  departments, viewMode, onViewModeChange,
  total, onAddNew,
}: EmployeeToolbarProps) {
  const activeFilterCount = [
    departmentId !== '',
    isActive !== '',
  ].filter(Boolean).length

  const clearFilters = () => {
    onDepartmentChange('')
    onIsActiveChange('')
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: '0.95rem' }}>
            All Employees
          </Typography>
          <Chip
            label={total}
            size="small"
            sx={{
              height: 20, fontSize: '0.68rem', fontWeight: 700,
              background: alpha('#6C8EFF', 0.12), color: '#6C8EFF',
              border: '1px solid rgba(108,142,255,0.2)',
              '& .MuiChip-label': { px: 0.8 },
            }}
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAddRoundedIcon />}
          onClick={onAddNew}
          size="small"
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          Add Employee
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <TextField
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email…"
          size="small"
          sx={{ flex: '1 1 220px', minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ fontSize: 18, color: '#475569' }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Department filter */}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel sx={{ fontSize: '0.85rem', color: '#475569' }}>Department</InputLabel>
          <Select
            value={departmentId}
            label="Department"
            onChange={(e) => onDepartmentChange(e.target.value as number | '')}
            sx={{ fontSize: '0.85rem' }}
          >
            <MenuItem value=""><em>All departments</em></MenuItem>
            {departments.map((d) => (
              <MenuItem key={d.id} value={d.id} sx={{ fontSize: '0.85rem' }}>
                {d.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status filter */}
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel sx={{ fontSize: '0.85rem', color: '#475569' }}>Status</InputLabel>
          <Select
            value={isActive === '' ? '' : String(isActive)}
            label="Status"
            onChange={(e) => {
              const v = e.target.value
              onIsActiveChange(v === '' ? '' : v === 'true')
            }}
            sx={{ fontSize: '0.85rem' }}
          >
            <MenuItem value=""><em>All statuses</em></MenuItem>
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </Select>
        </FormControl>

        {/* Clear filters */}
        {activeFilterCount > 0 && (
          <Box
            onClick={clearFilters}
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer',
              px: 1.2, py: 0.6, borderRadius: 1.5,
              border: '1px solid rgba(248,113,113,0.2)',
              color: '#F87171', fontSize: '0.75rem', fontWeight: 600,
              '&:hover': { background: alpha('#F87171', 0.08) },
            }}
          >
            <FilterListRoundedIcon sx={{ fontSize: 14 }} />
            Clear ({activeFilterCount})
          </Box>
        )}

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* View toggle */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, v) => v && onViewModeChange(v)}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              border: '1px solid rgba(148,163,184,0.15)',
              color: '#475569', px: 1.2, py: 0.6,
              '&.Mui-selected': { background: alpha('#6C8EFF', 0.12), color: '#6C8EFF' },
            },
          }}
        >
          <ToggleButton value="table"><TableRowsRoundedIcon sx={{ fontSize: 18 }} /></ToggleButton>
          <ToggleButton value="grid"><GridViewRoundedIcon sx={{ fontSize: 18 }} /></ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  )
}
