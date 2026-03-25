export const MenuInventoryView = ({
    inventory,
    handleSelect
}) => {
    return (
        <div style={{ marginTop: 12 }}>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(9, 1fr)",
                    gap: 2,
                    marginBottom: 8
                }}
            >
                {inventory.map((item, idx) => (
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
                        onClick={() => handleSelect(idx, item)}
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
        </div>
    )
}