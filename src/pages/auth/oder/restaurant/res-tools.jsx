import React, { useState } from "react";

const Restaurant_tools = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setDragging(true);
    setStartPosition({
      x: position.x, // Giữ nguyên vị trí X ban đầu
      y: touch.clientY - position.y, // Lấy tọa độ Y ban đầu
    });
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    const touch = e.touches[0];
    setPosition((prev) => ({
      x: prev.x, // Giữ nguyên vị trí X
      y: touch.clientY - startPosition.y, // Cập nhật vị trí Y
    }));
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };
  return (
    <div
      className="tools-bar"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        position: "absolute",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="items">
        <div className="icon">
          <i className="fa-solid fa-paper-plane"></i>
        </div>
      </div>
      <div className="items">
        <div className="icon">
          <i className="fa-solid fa-comments"></i>
        </div>
      </div>
    </div>
  );
};

export default Restaurant_tools;
