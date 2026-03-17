import { useEffect, useState } from 'react'
import { apiCall } from '../api/apiCall'
import { apiRoutes } from '../api/apiRoutes'

export const ServerFish = () => {
    const [fish, setFish] = useState([])
    const [selectedFish, setSelectedFish] = useState(null)
    const handleSelectFish = (selected = null) => setSelectedFish(selected)

    const getFish = async () => {
        const fishData = await apiCall(apiRoutes.fish.get)
        setFish(fishData)
    }

    useEffect(() => {
        getFish()
    }, [])

    console.log(fish)

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
                    width: "50%"
                }}>
                    <h1>Fish</h1>

                    {fish && fish.length > 0 ? (
                        <table style={{ borderCollapse: "collapse", width: "100%" }}>
                            <thead>
                                <tr>
                                    <th style={{ border: "1px solid black", padding: "4px" }}>Name</th>
                                    <th style={{ border: "1px solid black", padding: "4px" }}>Material</th>
                                    <th style={{ border: "1px solid black", padding: "4px" }}>Weight</th>
                                    <th style={{ border: "1px solid black", padding: "4px" }}>Gold Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fish.map((f) => (
                                    <tr
                                        key={f.name}
                                        onClick={() => handleSelectFish(f)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <td style={{ border: "1px solid black", padding: "4px" }}>{f.name}</td>
                                        <td style={{ border: "1px solid black", padding: "4px" }}>{f.material}</td>
                                        <td style={{ border: "1px solid black", padding: "4px" }}>{f.weight}</td>
                                        <td style={{ border: "1px solid black", padding: "4px" }}>{f.base_gold_value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No fish available</p>
                    )}
                </div>

            </div>
        </>
    )
}
