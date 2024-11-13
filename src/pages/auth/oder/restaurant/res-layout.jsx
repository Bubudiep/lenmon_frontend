import React from "react";
import table from "../../../../assets/icon/table.png";

const Restaurant_layout = ({ store }) => {
  return (
    <>
      <div className="th3">Bản đồ</div>
      <div className="p-layout">
        {store?.layouts.map((layout) => (
          <div key={layout.id} className="layout">
            {layout.groups.map((group) => (
              <div key={group.id} className="room">
                <div className="room-name">
                  <div className="name">{group.name}</div>
                </div>
                <div className="room-layout">
                  {group.spaces.map((space) => (
                    <div key={space.id} className="table">
                      <div className="status">
                        {space.is_ordering ? "Đã đặt" : "Trống"}
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
