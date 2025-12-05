import { styled, tableCellClasses } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

// 🎨 Color theme
export const headerBackground = 'linear-gradient(135deg, #4F77AA, #1E3C72)';
export const oddRowBackground = '#F0F6FF'; // soft blue tint
export const evenRowBackground = '#E4EDFA'; // deeper blue tone
export const hoverBackground = '#D7E7FF'; // distinct hover glow

//  Styled Components
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: headerBackground,
    color: theme.palette.common.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: 'center',
  },
}));

export const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(odd)': {
    backgroundColor: oddRowBackground,
  },
  '&:nth-of-type(even)': {
    backgroundColor: evenRowBackground,
  },
  '&:hover': {
    backgroundColor: hoverBackground,
  },
}));

// New Sub-Table Color Theme (Light Gray Professional Theme)
export const subHeaderBackground = '#C7EBE8';
export const subOddRowBackground = '#EAF8F7';
export const subEvenRowBackground = '#DDF4F2';
export const subHoverBackground = '#B5E3DF';

export const SubTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: subHeaderBackground,
    color: '#2C3E50',
    fontWeight: 600,
    textAlign: 'center',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    textAlign: 'center',
    color: '#2C3E50',
  },
}));

export const SubTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(odd)': {
    backgroundColor: subOddRowBackground,
  },
  '&:nth-of-type(even)': {
    backgroundColor: subEvenRowBackground,
  },
  '&:hover': {
    backgroundColor: subHoverBackground,
  },
}));
