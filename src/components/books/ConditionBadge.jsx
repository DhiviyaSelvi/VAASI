import React from 'react';
import { CONDITIONS } from '../../data/constants';

export default function ConditionBadge({ conditionKey }) {
  const normalized = conditionKey?.toLowerCase();
  
  let modifierClass = '';
  let label = 'Good';

  if (normalized === 'like_new' || normalized === 'like-new') {
    modifierClass = 'like-new';
    label = 'Like New';
  } else if (normalized === 'well_read' || normalized === 'well-read') {
    modifierClass = 'well-read';
    label = 'Well-read';
  } else if (normalized === 'fair') {
    label = 'Fair';
  } else {
    label = 'Good';
  }

  return (
    <span className={`cond ${modifierClass}`}>
      {label}
    </span>
  );
}
