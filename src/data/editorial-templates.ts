import { editorialExample } from './editorial-examples';
import { projectDefaults, type EditorialProject } from '../lib/editorial';
import { templateKinds, type EditorialTemplateId, type TemplateKind } from '../lib/editorial-template-ids';
export interface EditorialTemplate {
  id: EditorialTemplateId;
  name: string;
  question: string;
  reading: string;
  caution: string;
  provenance: 'World Bank data' | 'Fictional teaching data';
  project: EditorialProject;
}
const fictional = (
  kind: TemplateKind,
  table: string[][],
  patch: Partial<EditorialProject>,
): EditorialProject => ({
  ...projectDefaults,
  kind,
  table,
  zero: false,
  decimals: 0,
  source: 'SupaMakers · fictional teaching data · CC0',
  date: 'Illustrative values; not observations',
  ...patch,
});
const life = (
  id: EditorialTemplateId,
  kind: TemplateKind,
  name: string,
  question: string,
  reading: string,
  caution: string,
): EditorialTemplate => ({
  id,
  name,
  question,
  reading,
  caution,
  provenance: 'World Bank data',
  project: editorialExample(kind),
});
export const editorialTemplates: EditorialTemplate[] = [
  life(
    'life-expectancy-gap',
    'dumbbell',
    'Life expectancy: the gap between two years',
    'How far apart are the two endpoints for each country?',
    'India moves from 62.749 to 72.003 years: a difference of 9.254 years. The chart rounds labels to one decimal; the CSV retains source precision.',
    'These four selected countries are not a representative world sample. Endpoints conceal the annual path.',
  ),
  {
    id: 'commute-gap',
    name: 'Commute times for two groups',
    question: 'Where is the group difference largest?',
    reading:
      'The fictional Riverside journey is 38 minutes for bus riders and 24 for cyclists, a 14-minute gap. At Central the order reverses: 16 versus 22 minutes.',
    caution:
      'Group averages are not matched journeys or a causal effect of changing transport. Traffic, routes and travellers may differ.',
    provenance: 'Fictional teaching data',
    project: fictional(
      'dumbbell',
      [
        ['Area', 'Bus', 'Cycle'],
        ['Riverside', '38', '24'],
        ['Northside', '31', '26'],
        ['Central', '16', '22'],
        ['Parkside', '27', '21'],
      ],
      {
        title: 'The faster commute depends on the area',
        subtitle: 'Fictional average one-way journeys · minutes',
        unit: 'Minutes',
        theme: 'ocean',
        caption: 'Illustrative group averages; not matched journeys or evidence of a transport effect.',
        annotations: [
          { label: 'Central', series: 'Bus', text: 'The order reverses here: the bus average is lower.' },
        ],
      },
    ),
  },
  {
    id: 'library-access',
    name: 'Survey gaps in library access',
    question: 'Do two groups report the same access?',
    reading:
      'At East branch, 76% of the fictional weekday group and 54% of the weekend group report convenient hours: a 22 percentage-point difference.',
    caution:
      'Subtracting two percentages produces percentage points, not percent change. A real survey also needs question wording, sample sizes and uncertainty.',
    provenance: 'Fictional teaching data',
    project: fictional(
      'dumbbell',
      [
        ['Branch', 'Weekday', 'Weekend'],
        ['East', '76', '54'],
        ['West', '68', '61'],
        ['North', '81', '70'],
        ['South', '65', '67'],
      ],
      {
        title: 'Opening hours suit the groups differently',
        subtitle: 'Fictional survey · respondents reporting convenient hours',
        unit: 'Respondents (%)',
        zero: true,
        caption: 'Fictional percentages. Real survey reporting needs sample sizes and uncertainty.',
      },
    ),
  },
  {
    id: 'delivery-times',
    name: 'Delivery times before and after',
    question: 'Which depot saw the largest reduction?',
    reading:
      'South falls from 54 to 37 minutes, a 17-minute reduction. West rises from 39 to 43 minutes, so the pattern is not universal.',
    caution:
      'A before/after comparison does not isolate the cause. Use comparable routes, time windows and definitions before making a real operational claim.',
    provenance: 'Fictional teaching data',
    project: fictional(
      'dumbbell',
      [
        ['Depot', 'Before', 'After'],
        ['South', '54', '37'],
        ['North', '46', '35'],
        ['East', '42', '34'],
        ['West', '39', '43'],
      ],
      {
        title: 'Three depots improve; one takes longer',
        subtitle: 'Fictional median delivery time · before and after',
        unit: 'Minutes',
        theme: 'night',
        caption: 'Fictional medians; depot order is supplied, not automatically ranked.',
        annotations: [
          { label: 'West', series: 'After', text: 'West rises by 4 minutes while the other depots fall.' },
        ],
      },
    ),
  },
  life(
    'life-expectancy-change',
    'slopegraph',
    'Life expectancy: change between endpoints',
    'Which countries rose, and by how much?',
    'All four endpoint differences are positive. India rises by 9.254 years; Japan has the highest endpoint in both selected years.',
    'The connecting segment is not an annual trend. Open the full annual series before describing uninterrupted improvement.',
  ),
  {
    id: 'waiting-times',
    name: 'Service waiting times',
    question: 'Did the ordering of services change?',
    reading:
      'In this fictional comparison, permits fall from 18 to 9 days while appointments rise from 7 to 10. Their lines cross as their order changes.',
    caution:
      'Lower values are better here. Median waits do not describe the longest waits, demand levels or service quality.',
    provenance: 'Fictional teaching data',
    project: fictional(
      'slopegraph',
      [
        ['Service', 'Before', 'After'],
        ['Permits', '18', '9'],
        ['Appointments', '7', '10'],
        ['Repairs', '14', '11'],
        ['Enquiries', '5', '4'],
      ],
      {
        title: 'Shorter waits can change the ordering',
        subtitle: 'Fictional median wait by service · days',
        unit: 'Days',
        theme: 'ocean',
        zero: true,
        caption: 'Only two snapshots are shown. Lower is faster; the intermediate path is unknown.',
      },
    ),
  },
  {
    id: 'league-points',
    name: 'Ranking changes in league points',
    question: 'Who changed position between two snapshots?',
    reading:
      'Harbour leads the fictional first snapshot with 42 points, but Forest leads the second with 61. Points determine vertical position; line crossings reveal order changes.',
    caution:
      'These are points, not rank numbers. Rank gaps are not equal point gaps, and teams need comparable games played for a meaningful real comparison.',
    provenance: 'Fictional teaching data',
    project: fictional(
      'slopegraph',
      [
        ['Team', 'Snapshot 1', 'Snapshot 2'],
        ['Harbour', '42', '55'],
        ['Forest', '39', '61'],
        ['City', '35', '49'],
        ['Rovers', '31', '52'],
      ],
      {
        title: 'A new leader at the second snapshot',
        subtitle: 'Fictional league · four teams with equal games played',
        unit: 'Points',
        theme: 'night',
        caption: 'Fictional points, not rank numbers. Crossings show changes in relative order.',
      },
    ),
  },
  {
    id: 'energy-use',
    name: 'Energy use across two periods',
    question: 'Which buildings used less energy?',
    reading:
      'The fictional hall drops from 1,800 to 1,300 kWh, while the studio increases from 900 to 1,050 kWh. The chart retains absolute levels.',
    caution:
      'Absolute kWh do not adjust for floor area, weather or occupancy. A decrease alone does not establish improved efficiency.',
    provenance: 'Fictional teaching data',
    project: fictional(
      'slopegraph',
      [
        ['Building', 'Period 1', 'Period 2'],
        ['Hall', '1800', '1300'],
        ['Office', '1450', '1200'],
        ['Workshop', '1250', '1100'],
        ['Studio', '900', '1050'],
      ],
      {
        title: 'Energy use falls in three buildings',
        subtitle: 'Fictional equal-length periods · electricity consumption',
        unit: 'kWh',
        zero: false,
        caption: 'Absolute use; not adjusted for building size, weather or occupancy.',
      },
    ),
  },
  life(
    'life-expectancy-paths',
    'small-multiples',
    'Life expectancy: four annual paths',
    'Do the endpoints hide interruptions?',
    'The same 60–90-year axis makes levels comparable. Annual paths expose dips that disappear from the paired endpoint views.',
    'Separate panels share a scale, not a claim that these countries represent the world. Period life expectancy is not an individual prediction.',
  ),
  {
    id: 'library-visits',
    name: 'Monthly visits by library branch',
    question: 'Do branches peak at the same time?',
    reading:
      'In the fictional data East peaks at 180 visits in April, while West peaks at 170 in May. The shared axis preserves the difference in levels.',
    caution:
      'Counts do not adjust for opening days, catchment size or branch capacity. Do not describe a busier branch as more effective from these values alone.',
    provenance: 'Fictional teaching data',
    project: fictional(
      'small-multiples',
      [
        ['Month', 'East', 'West', 'North', 'South'],
        ['Jan', '110', '90', '60', '80'],
        ['Feb', '120', '105', '70', '85'],
        ['Mar', '150', '130', '85', '100'],
        ['Apr', '180', '155', '95', '105'],
        ['May', '160', '170', '90', '115'],
        ['Jun', '145', '150', '80', '110'],
      ],
      {
        title: 'The busiest month varies by branch',
        subtitle: 'Fictional monthly visits · four branches',
        unit: 'Visits',
        frame: 'square',
        zero: true,
        theme: 'ocean',
        caption: 'One shared value scale. Fictional counts are not adjusted for opening days.',
      },
    ),
  },
  {
    id: 'seasonal-orders',
    name: 'Seasonal orders by product',
    question: 'Do different products follow the same seasonal pattern?',
    reading:
      'The fictional tent series peaks in July at 140 orders; the coat series peaks in November at 140. Equal panel scales make the opposite timing visible.',
    caution:
      'Six selected months do not establish a recurring seasonal pattern. This numeric month axis preserves the gaps; it does not invent the intervening values.',
    provenance: 'Fictional teaching data',
    project: fictional(
      'small-multiples',
      [
        ['Month number', 'Tents', 'Coats', 'Bags'],
        ['1', '20', '120', '65'],
        ['3', '45', '75', '70'],
        ['5', '110', '30', '80'],
        ['7', '140', '20', '95'],
        ['9', '70', '85', '75'],
        ['11', '25', '140', '90'],
      ],
      {
        title: 'Different products peak at different times',
        subtitle: 'Fictional orders · selected months in one year',
        unit: 'Orders',
        frame: 'square',
        xMode: 'number',
        zero: true,
        theme: 'night',
        caption: 'Months 1, 3, 5, 7, 9 and 11 only. No recurring seasonality is established.',
      },
    ),
  },
  {
    id: 'route-reliability',
    name: 'On-time departures by route',
    question: 'Is a dip shared across routes?',
    reading:
      'All three fictional routes dip in March. Route A falls from 92% in February to 84% in March, an 8 percentage-point decrease.',
    caution:
      'The shared dip does not identify a cause. Real reporting needs a consistent on-time threshold, departure counts and the treatment of cancellations.',
    provenance: 'Fictional teaching data',
    project: fictional(
      'small-multiples',
      [
        ['Month', 'Route A', 'Route B', 'Route C'],
        ['Jan', '91', '87', '94'],
        ['Feb', '92', '88', '95'],
        ['Mar', '84', '79', '89'],
        ['Apr', '89', '85', '92'],
        ['May', '93', '89', '95'],
        ['Jun', '94', '90', '96'],
      ],
      {
        title: 'Three routes share a dip in March',
        subtitle: 'Fictional on-time departures · January–June',
        unit: 'Departures (%)',
        frame: 'square',
        zero: false,
        caption: 'A cropped, shared percentage axis. Thresholds and departure counts are unspecified.',
      },
    ),
  },
];
export const templateById = (id: EditorialTemplateId) => editorialTemplates.find((t) => t.id === id)!;
export const templatesFor = (kind: string) => editorialTemplates.filter((t) => templateKinds[t.id] === kind);
