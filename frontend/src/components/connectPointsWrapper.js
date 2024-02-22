import React, { useRef, useState } from 'react';
import Xarrow from "react-xarrows";


const ConnectPointsWrapper = ({ className, handler, dragRef, boxRef }) => {
    const ref1 = useRef();

    const [position, setPosition] = useState({});
    const [beingDragged, setBeingDragged] = useState(false);
    const connectPointStyle = {
        position: "absolute",
        width: 10,
        height: 10,
        borderRadius: "10%",
        background: "white",
    };

    const connectPointOffset = {
        left: { left: 0, top: "50%", transform: "translate(-50%, -50%)" },
        right: { left: "100%", top: "50%", transform: "translate(-50%, -50%)" },
        top: { left: "50%", top: 0, transform: "translate(-50%, -50%)" },
        bottom: { left: "50%", top: "100%", transform: "translate(-50%, -50%)" },
    };

    return (
        <React.Fragment>
            <div
                className="connectPoint"
                style={{
                    ...connectPointStyle,
                    ...connectPointOffset[handler],
                    ...position
                }}
                draggable
                onMouseDown={(e) => e.stopPropagation()}
                onDragStart={(e) => {
                    setBeingDragged(true);
                    e.dataTransfer.setData("arrow", className);
                }}
                onDrag={(e) => {
                    const { offsetTop, offsetLeft } = boxRef.current;
                    const { x, y } = dragRef.current.state;
                    setPosition({
                        position: "fixed",
                        left: e.clientX - x - offsetLeft,
                        top: e.clientY - y - offsetTop,
                        transform: "none",
                        opacity: 0,
                    });
                }} ref={ref1}
                onDragEnd={() => {
                    setPosition({});
                    setBeingDragged(false);
                }}
            />
            {beingDragged ? <Xarrow start={className} end={ref1} /> : null}
        </React.Fragment>
    );
};



export default ConnectPointsWrapper;

