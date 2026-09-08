export const dotPresets = [
  {
    id: 'scores',
    name: 'Class scores',
    title: 'Class scores, at a glance',
    label: 'Score out of 100',
    values: [
      52, 56, 60, 60, 64, 64, 64, 68, 68, 68, 68, 72, 72, 72, 72, 72, 76, 76, 76, 76, 76, 76, 76, 80, 80, 80,
      80, 80, 80, 80, 80, 84, 84, 84, 84, 84, 84, 88, 88, 88, 88, 88, 92, 92, 92, 96, 96, 100,
    ],
    note: 'Forty-eight fictional scores. Each dot represents one student; stacked dots show repeated scores.',
  },
  {
    id: 'delivery',
    name: 'Delivery times',
    title: 'Most orders arrive in three days',
    label: 'Delivery time (days)',
    values: [1, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 5, 5, 7],
    note: 'Fourteen fictional deliveries. The seven-day delivery stays visible instead of being removed as an outlier.',
  },
  {
    id: 'books',
    name: 'Books read',
    title: 'A month in books',
    label: 'Books read this month',
    values: [0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 5, 6],
    note: 'Twelve fictional readers. Zero is a real observation here; it is different from an empty cell.',
  },
];

export const radarPresets = [
  {
    id: 'skills',
    name: 'Team skills',
    title: 'Different strengths. One team.',
    series: ['Alex', 'Sam'],
    axes: ['Research', 'Design', 'Writing', 'Strategy', 'Engineering', 'Communication'],
    scores: [
      [8, 5],
      [9, 6],
      [7, 8],
      [8, 7],
      [5, 9],
      [8, 7],
    ],
    max: 10,
    note: 'Fictional self-assessments on the same 0–10 scale. These are illustrative scores, not validated measures.',
  },
  {
    id: 'products',
    name: 'Product comparison',
    title: 'Where each option stands',
    series: ['Option A', 'Option B'],
    axes: ['Ease of use', 'Features', 'Support', 'Value', 'Flexibility'],
    scores: [
      [9, 6],
      [6, 9],
      [8, 7],
      [8, 6],
      [5, 9],
    ],
    max: 10,
    note: 'Fictional ratings with higher consistently meaning better. Raw prices and ratings should not share a scale.',
  },
  {
    id: 'week',
    name: 'Weekly reflection',
    title: 'This week, compared with last',
    series: ['This week', 'Last week'],
    axes: ['Rest', 'Movement', 'Focus', 'Connection', 'Creativity'],
    scores: [
      [7, 5],
      [8, 6],
      [6, 8],
      [9, 5],
      [7, 4],
    ],
    max: 10,
    note: 'Fictional personal reflections, not health measurements. Compare like-for-like questions on the same scale.',
  },
];
export const colors = ['#cb6244', '#347b74', '#7370a6', '#a2742f', '#537ba1'];
