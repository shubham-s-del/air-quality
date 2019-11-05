import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import {
  FlexibleWidthXYPlot,
  DiscreteColorLegend,
  YAxis,
  XAxis,
  Crosshair,
  LineSeries
} from 'react-vis'
import objectPath from 'object-path'

import CrosshairBody from './CrosshairBody'

const aurora = [
  '#D08770',
  '#A3BE8C',
  '#EBCB8B',
  '#B48EAD',
  '#BF616A'
]

export default ({ data, keys, formatter = (v) => v, labels = keys }) => {
  const [hovered, setHovered] = useState([])
  const [setHoveredIndex] = useDebouncedCallback((index) => {
    if (typeof index !== 'number') return setHovered([])
    const c = data[index]
    setHovered(keys.map(
      (key) => objectPath.get({
        x: Date.parse(c.payload.rec),
        y: objectPath.get(c.payload.val, key)
      })
    ))
  }, 1000, { maxWait: 100 })

  return (<div className='plot'>
    <FlexibleWidthXYPlot height={300} margin={{ left: 100 }} onMouseLeave={() => setHoveredIndex(null)}>
      <DiscreteColorLegend
        items={labels.map((label, index) => ({
          title: label,
          color: aurora[index % aurora.length]
        }))}
      />

      <YAxis tickFormat={formatter} />
      <XAxis
        tickTotal={4}
        tickFormat={(when) => new Date(when).toLocaleTimeString('en-US')}
      />

      {keys.map((key, index) => (
        <LineSeries
          key={index}
          className={`series-${index}`}
          data={data.reduce((p, c) => {
            p.push({
              x: Date.parse(c.payload.rec),
              y: objectPath.get(c.payload.val, key)
            })
            return p
          }, [])}
          style={{
            fill: 'transparent'
          }}
          strokeWidth={2}
          color={aurora[index % aurora.length]}
          onNearestX={index === 0 ? (_, { index }) => setHoveredIndex(index) : undefined}
        />
      ))}

      {hovered.length ? (
        <Crosshair values={hovered}>
          <CrosshairBody
            hovered={hovered}
            keys={keys}
            labels={labels}
            formatter={formatter}
          />
        </Crosshair>
      ) : []}
    </FlexibleWidthXYPlot>

    <style jsx>{`
      .plot {
        margin-bottom: 40px;
      }
    `}</style>
    <style jsx global>{`
      .rv-xy-plot {
        position: relative;
      }

      .rv-xy-plot__axis__tick__text {
        fill: #D8DEE9;
      }

      .rv-discrete-color-legend {
        color: #D8DEE9;
        position: absolute;
        font-size: 14px;
        pointer-events: none;
        top: 0;
        right: 0;
        z-index: 88;
      }

      .rv-discrete-color-legend svg {
        height: 10px;
        margin-right: 4px;
      }

      .rv-discrete-color-legend svg path {
        stroke-width: 20px;
      }
    `}</style>
  </div>)
}