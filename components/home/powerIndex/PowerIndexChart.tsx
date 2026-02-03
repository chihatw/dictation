'use client';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const formatDayLabel = (day: string) => day.slice(5).replace('-', '/');

export default function PowerIndexChart({
  data,
  yDomain,
}: {
  data: { day: string; score: number }[];
  yDomain: [number, number];
}) {
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
      >
        <XAxis
          dataKey='day'
          tickFormatter={formatDayLabel}
          tick={{ fontSize: 10 }}
        />

        <YAxis hide domain={yDomain} />

        <Tooltip
          formatter={(value) => [value, '指數']}
          labelFormatter={() => ''}
        />

        <Line
          type='monotone'
          dataKey='score'
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 4 }}
          stroke='#334155'
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
