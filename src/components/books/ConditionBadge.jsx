import React from 'react';
import { CONDITIONS } from '../../data/constants';

export default function ConditionBadge({ conditionKey }) {
  const cond = CONDITIONS[conditionKey?.toUpperCase()] || { label: conditionKey || 'Good', color: 'var(--color-quiet-grey)' };
  
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 'var(--radius-sm)',
      fontSize: '0.75rem',
      fontWeight: '600',
      backgroundColor: 'var(--color-light-grey)',
      color: cond.color,
      border: `1px solid ${cond.color}`
    }}>
      {cond.label}
    </span>
  );
}
