import { useState, KeyboardEvent } from 'react'
import { Box, Chip, TextField, Typography, alpha } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'

interface SkillsInputProps {
  value: string[]
  onChange: (skills: string[]) => void
  error?: string
  disabled?: boolean
}

export default function SkillsInput({ value, onChange, error, disabled }: SkillsInputProps) {
  const [inputVal, setInputVal] = useState('')

  const addSkill = () => {
    const trimmed = inputVal.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInputVal('')
  }

  const removeSkill = (skill: string) => {
    onChange(value.filter((s) => s !== skill))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill()
    }
    if (e.key === 'Backspace' && !inputVal && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <Box>
      <Typography
        variant="caption"
        sx={{ color: '#64748B', mb: 0.8, display: 'block', fontSize: '0.78rem' }}
      >
        Skills
      </Typography>
      <Box
        sx={{
          minHeight: 52,
          border: `1px solid ${error ? '#F87171' : 'rgba(148,163,184,0.2)'}`,
          borderRadius: 2,
          px: 1.5, py: 1,
          display: 'flex', flexWrap: 'wrap', gap: 0.8, alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.5)',
          transition: 'border-color 0.2s',
          '&:focus-within': {
            borderColor: error ? '#F87171' : 'rgba(108,142,255,0.6)',
          },
        }}
      >
        {value.map((skill) => (
          <Chip
            key={skill}
            label={skill}
            size="small"
            onDelete={disabled ? undefined : () => removeSkill(skill)}
            sx={{
              height: 24, fontSize: '0.72rem', fontWeight: 600,
              background: alpha('#6C8EFF', 0.12),
              color: '#6C8EFF',
              border: '1px solid rgba(108,142,255,0.25)',
              '& .MuiChip-deleteIcon': { color: 'rgba(108,142,255,0.5)', fontSize: 14 },
              '& .MuiChip-deleteIcon:hover': { color: '#6C8EFF' },
            }}
          />
        ))}
        {!disabled && (
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 120 }}>
            <TextField
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={addSkill}
              placeholder={value.length === 0 ? 'Type skill and press Enter…' : '+ Add more'}
              variant="standard"
              size="small"
              InputProps={{ disableUnderline: true }}
              sx={{
                flex: 1,
                '& input': {
                  fontSize: '0.82rem', color: '#E2E8F0', p: 0,
                  '&::placeholder': { color: '#334155' },
                },
              }}
            />
            {inputVal && (
              <Box
                onClick={addSkill}
                sx={{
                  cursor: 'pointer', color: '#6C8EFF',
                  display: 'flex', alignItems: 'center',
                }}
              >
                <AddRoundedIcon sx={{ fontSize: 18 }} />
              </Box>
            )}
          </Box>
        )}
      </Box>
      {error && (
        <Typography variant="caption" sx={{ color: '#F87171', mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}
      <Typography variant="caption" sx={{ color: '#334155', mt: 0.4, display: 'block', fontSize: '0.68rem' }}>
        Press Enter or comma to add. Backspace to remove last.
      </Typography>
    </Box>
  )
}
