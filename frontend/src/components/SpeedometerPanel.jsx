import React, { useEffect, useMemo, useState } from 'react'
import io from 'socket.io-client'
import ReactSpeedometer from 'react-d3-speedometer'

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:4000'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function SpeedometerPanel() {
  const [speed, setSpeed] = useState(0)
  const [ts, setTs] = useState(null)
  const socket = useMemo(() => io(WS_URL, { transports: ['websocket'] }), [])

  useEffect(() => {
    fetch(`${API_URL}/api/speed/latest`)
      .then(r => r.json()).then(d => { if (d?.speed != null) setSpeed(d.speed) })
    socket.on('speedUpdate', ({ speed, ts }) => {
      if (speed != null) {
        setSpeed(speed);
        setTs(ts);
      }
    });
    return () => socket.disconnect()
  }, [])

  return (
    <div style={{width:420,maxWidth:'95vw',textAlign:'center'}}>
      <h2>Live Speedometer</h2>
      <ReactSpeedometer maxValue={120} value={speed} segments={10}
        currentValueText={`Current: ${speed} km/h`} />
      <div style={{fontSize:12,marginTop:8,opacity:0.8}}>
        {ts ? `Last update: ${new Date(ts).toLocaleTimeString()}` : 'Waiting...'}
      </div>
    </div>
  )
}
