import React from "react";
import table from "../../../../assets/icon/table.png";

const Restaurant_layout = ({ store }) => {
  return (
    <>
      <div className="p-layout slide-top">
        {store?.layouts.map((layout) => (
          <div key={layout.id} className="layout">
            {layout.groups.map((group) => (
              <div key={group.id} className="room">
                <div className="room-name">
                  <div className="name">{group.name}</div>
                </div>
                <div className="room-layout">
                  {group.spaces.map((space) => (
                    <div
                      key={space.id}
                      className={`table ${
                        space.is_ordering
                          ? "oder"
                          : space.is_inuse
                            ? "inuse"
                            : ""
                      }`}
                    >
                      <div className="status">
                        {space.is_ordering
                          ? "Đã đặt trước"
                          : space.is_inuse
                            ? "Đang dùng"
                            : "Trống"}
                      </div>
                      <div className="icon">
                        <img src={table} alt="Table Icon" />
                      </div>
                      <div className="name">{space.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default Restaurant_layout;
