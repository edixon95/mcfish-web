import { useState } from 'react'
import './App.css'
import { PlayerTab } from './tabs/PlayerTab'
import { ServerFish } from './tabs/ServerFish'
import { ConfigTab } from './tabs/ConfigTab'
import { MenuTab } from './tabs/MenuTab'

function App() {
  const tabs = [
    "Players",
    "Fish",
    "Config",
    "Menus"
  ]
  const [activeTab, setActiveTab] = useState("Players")


  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ display: "flex", gap: 25, height: "5%", backgroundColor: "grey" }}>
        {tabs.map((t) => (<div style={{
          backgroundColor: activeTab === t ? "green" : "#fff",
          color: activeTab === t ? "#fff" : "#000",
          border: "2px solid black",
          height: "100%",
          width: 150,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer"
        }}
          onClick={() => setActiveTab(t)}
        >{t}</div>))}
      </div>
      <div style={{
        height: "90%"
      }}>
        {activeTab === "Players" ? <PlayerTab /> : null}
        {activeTab === "Fish" ? <ServerFish /> : null}
        {activeTab === "Config" ? <ConfigTab /> : null}
        {activeTab === "Menus" ? <MenuTab /> : null}
      </div>

    </div>
  )
}

export default App
