import { useEffect, useState } from 'react'
import { apiCall } from '../api/apiCall'
import { apiRoutes } from '../api/apiRoutes'
import { InventoryView } from '../components/InventoryView'
import { ItemEditor } from '../components/ItemEditor'
import { defaultItem } from '../util/defaultItem'
import { MenuInventoryView } from '../components/MenuInventoryView'

export const MenuTab = () => {
    const [menus, setMenus] = useState(null)
    const [selectedMenu, setSelectedMenu] = useState(null)
    const [selected, setSelected] = useState(null)
    const getMenus = async () => {
        const res = await apiCall(apiRoutes.menus.get)

        const parsedMenus = res.map(menu => ({
            ...menu,
            menu_inventory: JSON.parse(menu.menu_inventory)
        }))

        setMenus(parsedMenus)
    }

    const saveMenu = async () => {
        if (!selectedMenu) return;

        if (selectedMenu?.id) {

            const { name, size, menu_inventory, id } = selectedMenu;

            try {
                await apiCall(apiRoutes.menus.update, 'POST', {
                    name,
                    size,
                    menu_inventory,
                    id
                });
                alert("Saved successfully!");
            } catch (err) {
                console.error(err);
                alert("Failed to save: " + err.message);
            }
        } else {
            const { name, size, menu_inventory } = selectedMenu;

            try {
                await apiCall(apiRoutes.menus.add, 'POST', {
                    name,
                    size,
                    menu_inventory
                });
                alert("Saved successfully!");
            } catch (err) {
                console.error(err);
                alert("Failed to save: " + err.message);
            }
        }


    };
    useEffect(() => {
        getMenus()
    }, [])

    const updateInventory = (index, newItem) => {
        const inv = [...selectedMenu.menu_inventory] // clone array
        inv[index] = newItem

        setSelectedMenu({
            ...selectedMenu,
            menu_inventory: inv
        })

        setSelected({
            index,
            data: newItem
        })
    }

    const handleSelect = ({ index, data }) => {
        if (!data) {
            data = defaultItem()
        }

        setSelected({ index, data })
    }

    console.log(selectedMenu)

    return (

        <div
            style={{
                display: "flex",
                gap: 20
            }}>

            {/* inventory */}
            <div>
                <h1>Menus</h1>
                <div>
                    {menus && menus.length > 0 &&
                        menus.map((m) => (
                            <div style={{
                                cursor: "pointer"
                            }}
                                onClick={() => setSelectedMenu(m)}
                            >
                                {m.name}
                            </div>
                        ))
                    }
                </div>
            </div>

            <div>
                <div style={{ backgroundColor: "red", width: "65%" }}>
                    {selectedMenu?.menu_inventory &&

                        <MenuInventoryView
                            inventory={selectedMenu.menu_inventory}
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
                                <button onClick={saveMenu}>Save Config</button>
                            </div>
                        </>
                    )}

                </div>
            </div>


        </div>

    )
}