import React from 'react'
import SpeedometerPanel from './components/SpeedometerPanel.jsx'
export default function App() {
  return (
    <div style={{display:'grid',placeItems:'center',minHeight:'100dvh',padding:16}}>
      <SpeedometerPanel/>
    </div>
  )
}
