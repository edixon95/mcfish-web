import { useEffect, useState } from 'react'
import { apiCall } from '../api/apiCall'
import { apiRoutes } from '../api/apiRoutes'

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
                        <div>
                            <button onClick={() => setIsPolling(!isPolling)}>{isPolling ? "Stop pinging" : "Poll player"}</button>
                        </div>
                    </div>

                    {selectedPlayer?.inventory && (
                        <div style={{ marginTop: 12 }}>


                            {/* Inventory grid (slots 9–35) */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(9, 1fr)",
                                    gap: 2,
                                    marginBottom: 8
                                }}
                            >
                                {selectedPlayer.inventory.slice(9, 36).map((item, idx) => (
                                    <div
                                        key={idx + 9}
                                        style={{
                                            aspectRatio: "1 / 1",
                                            border: "1px solid gray",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor:
                                                item?.components && Object.keys(item.components).length > 0
                                                    ? "#8e7df3"
                                                    : item
                                                        ? "#f0f0f0"
                                                        : "#fff",
                                        }}
                                        onClick={() => handleSelectInventorySquare(idx + 9, item)}
                                    >
                                        {item && (
                                            <div style={{ fontSize: 17, textAlign: "center" }}>
                                                {item.id.split(":")[1]}
                                                <br />
                                                x{item.count}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Hotbar */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(9, 1fr)", // 9 equal columns
                                    gap: 2,
                                    marginBottom: 8
                                }}
                            >
                                {selectedPlayer.inventory.slice(0, 9).map((item, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            aspectRatio: "1 / 1", // perfect square
                                            border: "1px solid gray",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor:
                                                item?.components && Object.keys(item.components).length > 0
                                                    ? "#8e7df3"
                                                    : item
                                                        ? "#f0f0f0"
                                                        : "#fff",
                                        }}
                                        onClick={() => handleSelectInventorySquare(idx, item)}
                                    >
                                        {item && (
                                            <div style={{ fontSize: 17, textAlign: "center" }}>
                                                {item.id.split(":")[1]}
                                                <br />
                                                x{item.count}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {selectedInventorySquare?.data && (
                                <div style={{ border: "1px solid black", padding: 8 }}>
                                    <div><strong>Selected</strong></div>
                                    <div>id: {selectedInventorySquare.data.id}</div>
                                    <div>count: {selectedInventorySquare.data.count}</div>

                                    {selectedInventorySquare.data.components && (
                                        <div>
                                            <strong>Components:</strong>
                                            {Object.entries(selectedInventorySquare.data.components).map(([key, value]) => (
                                                <div key={key}>
                                                    <span>{key}: </span>
                                                    <pre style={{ display: "inline", whiteSpace: "pre-wrap" }}>{value}</pre>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
