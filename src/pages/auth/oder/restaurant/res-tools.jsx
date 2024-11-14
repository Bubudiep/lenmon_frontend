import React, { useRef, useState } from "react";

const Restaurant_tools = ({ setConfig }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [hide, sethide] = useState(false);
  const [trastion, setTrastion] = useState(0);
  const [isLeft, setIsLeft] = useState("tright");
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const toolsBarRef = useRef(null);

  // Hàm để vô hiệu hóa cuộn trang
  const disableScroll = () => {
    document.body.style.overflow = "hidden";
  };

  // Hàm để bật lại cuộn trang
  const enableScroll = () => {
    document.body.style.overflow = "";
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setDragging(true);
    disableScroll();
    setStartPosition({
      x: touch.clientX - position.x, // Lấy tọa độ X ban đầu
      y: touch.clientY - position.y, // Lấy tọa độ Y ban đầu
    });
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    setTrastion(0);
    setIsLeft(false);
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - startPosition.x, // Cập nhật vị trí X
      y: touch.clientY - startPosition.y, // Cập nhật vị trí Y
    });
  };
  const handleTouchEnd = () => {
    setDragging(false);
    setTrastion(0.3);
    enableScroll();
    setPosition((prevPosition) => ({
      x: 0,
      y: prevPosition.y, // Giữ nguyên vị trí Y
    }));
    setTimeout(() => {
      setIsLeft("tright");
    }, 300);
  };
  const handleOrder = () => {
    setConfig("Order");
  };
  const handleChatrom = () => {
    setConfig("Chatroom");
  };
  const handleQRcode = () => {
    setConfig("QRcode");
  };
  return (
    <div
      ref={toolsBarRef}
      className={`tools-bar ${isLeft ? isLeft : ""} ${hide ? "hide" : ""}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        position: "absolute",
        transition: `all ${trastion}s`,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => {
        sethide(!hide);
        handleTouchEnd();
      }}
    >
      <div className="bar">
        <div className="this-bar"></div>
      </div>
      <div className="list-items">
        <div className="items" onClick={handleOrder}>
          <div className="icon">
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <div className="items" onClick={handleChatrom}>
          <div className="icon">
            <i className="fa-solid fa-comments"></i>
          </div>
        </div>
        <div className="items" onClick={handleQRcode}>
          <div className="icon">
            <i className="fa-solid fa-qrcode"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurant_tools;
