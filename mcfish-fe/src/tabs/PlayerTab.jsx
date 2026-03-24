import { useEffect, useState } from 'react'
import { apiCall } from '../api/apiCall'
import { apiRoutes } from '../api/apiRoutes'
import { InventoryView } from '../components/InventoryView'

export const PlayerTab = () => {
    const [players, setPlayers] = useState([])
    const [selectedPlayer, setSelectedPlayer] = useState(null)
    const [isPolling, setIsPolling] = useState(false)
    const handleSelectPlayer = (selected = null) => setSelectedPlayer(selected)
    const [selectedInventorySquare, setSelectedInventorySquare] = useState({
        index: null,
        data: null
    })
    const handleSelectInventorySquare = (index = null, data = null) => setSelectedInventorySquare({ index, data })

    const getPlayers = async () => {
        const playerData = await apiCall(apiRoutes.players.get)
        setPlayers(playerData)
    }

    useEffect(() => {
        getPlayers()
    }, [])

    useEffect(() => {
        if (!selectedPlayer)
            setSelectedInventorySquare({
                index: null,
                data: null
            })

    }, [selectedPlayer])

    useEffect(() => {
        if (!isPolling || !selectedPlayer) return; // only poll if true and a player is selected

        const interval = setInterval(async () => {
            try {
                const updatedPlayer = await apiCall(
                    `${apiRoutes.players.poll}?playerName=${encodeURIComponent(selectedPlayer.name)}`
                );
                setSelectedPlayer(updatedPlayer);
            } catch (err) {
                console.error('Failed to poll player:', err);
            }
        }, 10000); // 10 seconds

        // Cleanup function stops polling when isPolling becomes false or component unmounts
        return () => clearInterval(interval);
    }, [isPolling, selectedPlayer]);

    console.log(selectedInventorySquare)

    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    height: "100%"
                }}
            >
                <div style={{
                    border: "1px solid black",
                    height: "100%",
                    width: "25%"
                }}>
                    <h1>Players</h1>
                    {players && players.length > 0 &&
                        players.map((player) => (
                            <div key={player.uuid} onClick={() => handleSelectPlayer(player)}>{player.name}</div>
                        ))
                    }
                </div>
                <div style={{ border: "1px solid black", padding: 8, width: "72%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>Selected Player: {selectedPlayer?.name ?? "No user selected"}</div>
                        {selectedPlayer &&
                            <div>
                                <div>
                                    <p>Gold: {selectedPlayer.currency1}</p>
                                    <p>Premium: {selectedPlayer.currency2}</p>
                                </div>
                                <button onClick={() => setIsPolling(!isPolling)}>{isPolling ? "Stop pinging" : "Poll player"}</button>
                            </div>
                        }
                    </div>

                    {selectedPlayer?.inventory && (
                        <InventoryView
                            inventory={selectedPlayer.inventory}
                            handleSelect={handleSelectInventorySquare}
                        />
                    )}
                </div>
            </div>
        </>
    )
}
