import { useEffect, useState } from 'react'
import { apiCall } from '../api/apiCall'
import { apiRoutes } from '../api/apiRoutes'
import { InventoryView } from '../components/InventoryView'
import { ItemEditor } from '../components/ItemEditor'

export const ConfigTab = () => {
    const [cfg, setCfg] = useState(null)
    const [selected, setSelected] = useState(null)
    const getConfig = async () => {
        const res = await apiCall(apiRoutes.config.get)
        setCfg({
            ...res,
            player_inventory: JSON.parse(res.player_inventory)
        })
    }
    const saveConfig = async () => {
        if (!cfg) return;

        try {
            await apiCall(apiRoutes.config.update, 'POST', {
                player_inventory: cfg.player_inventory,
                version: cfg.version
            });
            alert("Saved successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to save: " + err.message);
        }
    };
    useEffect(() => {
        getConfig()
    }, [])

    const updateInventory = (index, newItem) => {
        const inv = [...cfg.player_inventory]
        inv[index] = newItem
        setCfg({
            ...cfg,
            player_inventory: inv
        })
    }

    const handleSelect = ({ index, data }) => {
        if (!data) {
            data = {
                DataVersion: 4671,
                id: "minecraft:stone",
                count: 1,
                components: {
                    "minecraft:custom_name": "{\"extra\":[{\"text\":\"Example Name\",\"color\":\"aqua\",\"bold\":1,\"italic\":0,\"underlined\":0,\"strikethrough\":0,\"obfuscated\":0}],\"text\":\"\"}",
                    "minecraft:lore": "[{\"extra\":[{\"text\":\"Example stat\",\"color\":\"white\",\"bold\":0,\"italic\":0,\"underlined\":0,\"strikethrough\":0,\"obfuscated\":0}],\"text\":\"\"}]",
                    "minecraft:custom_data": "{PublicBukkitValues:{\"minecraftfish:exampleKey\":\"exampleValue\"}}"
                },
                schema_version: 1
            }
        }

        setSelected({ index, data })
    }

    if (!cfg) return null

    return (

        <div
            style={{
                display: "flex",
                gap: 20
            }}>

            {/* inventory */}

            <div style={{ backgroundColor: "red", width: "65%" }}>
                {cfg?.player_inventory &&
                    <InventoryView
                        inventory={cfg.player_inventory}
                        handleSelect={(idx, item) => handleSelect({ index: idx, data: item })}
                    />
                }

            </div>
            <div style={{ width: "33%" }}>
                {/* Deep editor */}
                {selected && (
                    <>
                        <ItemEditor
                            selected={selected}
                            updateInventory={updateInventory}
                        />
                        <div style={{ marginTop: 10 }}>
                            <button onClick={saveConfig}>Save Config</button>
                        </div>
                    </>
                )}

            </div>


        </div>

    )
}