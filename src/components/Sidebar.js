import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addSprite } from '../store/spritesSlice';
import { setRepeatEvents } from '../store/repeatSlice';

export default function Sidebar() {
  const dispatch = useDispatch();
  const [spriteType, setSpriteType] = useState('cat');
  const [moveSteps, setMoveSteps] = useState(10);
  const [turnDegrees, setTurnDegrees] = useState(15);
  const [goToX, setGoToX] = useState(0);
  const [goToY, setGoToY] = useState(0);
  const [repeatTimes, setRepeatTimes] = useState(5);
  const [message, setMessage] = useState(''); 
  const [duration, setDuration] = useState(1); 

  const handleAddSprite = () => {
    const newSprite = {
      id: Date.now(),
      x: 50,
      y: 200,
      rotation: 0,
      type: spriteType,
      direction: 1,
      initialX: 50,
      initialY: 200,
      message: "", 
    };
    dispatch(addSprite(newSprite));
  };

  const handleDragStart = (e, actionType, actionValue) => {
    e.dataTransfer.setData("actionType", actionType);
    e.dataTransfer.setData("actionValue", JSON.stringify(actionValue));
  };

  
  const handleRepeatChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setRepeatTimes(value);
    dispatch(setRepeatEvents({ [spriteType]: value })); 
  };

  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      <h2 className="font-bold">Motion</h2>
      
      <div className="mb-4">
        <label className="font-bold">Sprite Type:</label>
        <select
          className="border border-gray-300 px-2 py-1 ml-2"
          value={spriteType}
          onChange={(e) => setSpriteType(e.target.value)}
        >
          <option value="cat">Cat</option>
          <option value="chicken">Chicken</option>
        </select>
      </div>

      <div
        className="flex flex-row bg-blue-500 text-black px-2 py-1 my-2 cursor-pointer draggable"
        draggable
        onDragStart={(e) => handleDragStart(e, "move", { steps: moveSteps })}
      >
        Move
        <input
          type="number"
          value={isNaN(moveSteps) ? '' : moveSteps}
          onChange={(e) => setMoveSteps(parseInt(e.target.value, 10) || 0)}
          className="mx-2 w-10 text-black border border-gray-300"
        />
        steps
      </div>

      <div
        className="flex flex-row bg-blue-500 text-black px-2 py-1 my-2 cursor-pointer draggable"
        draggable
        onDragStart={(e) => handleDragStart(e, "turn", { degrees: turnDegrees })}
      >
        Turn
        <input
          type="number"
          value={isNaN(turnDegrees) ? '' : turnDegrees}
          onChange={(e) => setTurnDegrees(parseInt(e.target.value, 10) || 0)}
          className="mx-2 w-10 text-black border border-gray-300"
        />
        degrees
      </div>

      <div
        className="flex flex-row bg-blue-500 text-black px-2 py-1 my-2 cursor-pointer draggable"
        draggable
        onDragStart={(e) => handleDragStart(e, "goTo", { x: goToX, y: goToY })}
      >
        Go to x:
        <input
          type="number"
          value={isNaN(goToX) ? '' : goToX}
          onChange={(e) => setGoToX(parseInt(e.target.value, 10) || 0)}
          className="mx-2 w-10 text-black border border-gray-300"
        />
        y:
        <input
          type="number"
          value={isNaN(goToY) ? '' : goToY}
          onChange={(e) => setGoToY(parseInt(e.target.value, 10) || 0)}
          className="mx-2 w-10 text-black border border-gray-300"
        />
      </div>

      <div
        className="flex flex-row bg-yellow-500 text-black px-2 py-1 my-2 cursor-pointer draggable"
        draggable
        onDragStart={(e) => handleDragStart(e, "repeat", { times: repeatTimes })}
      >
        Repeat
        <input
          type="number"
          value={isNaN(repeatTimes) ? '' : repeatTimes}
          onChange={handleRepeatChange}
          className="mx-2 w-10 text-black border border-gray-300"
        />
        times
      </div>
      <div
         className="flex flex-row bg-purple-400 text-black px-2 py-1 my-2 cursor-pointer draggable"
          draggable
          onDragStart={(e) => handleDragStart(e, "sayHi", { message: "Hi" })}
       >
        Say Hi
       </div>

      <div
        className="flex flex-col bg-purple-500 text-black px-2 py-1 my-2 cursor-pointer draggable"
        draggable
        onDragStart={(e) => handleDragStart(e, "sayMessage", { message, duration })}
      >
        <div className="flex flex-row items-center">
          Say:
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message"
            className="mx-2 w-20 text-black border border-gray-300"
          />
        </div>
        <div className="flex flex-row items-center">
          For:
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value, 10) || 1)}
            className="mx-2 w-10 text-black border border-gray-300"
          />
          sec
        </div>
      </div>
      <div
  className="flex flex-row bg-yellow-500 text-black px-2 py-1 my-2 cursor-pointer draggable"
  draggable
  onDragStart={(e) => handleDragStart(e, "whenSpriteIsClicked", {})}
>
  When Sprite is clicked
</div>
<div
  className="flex flex-row bg-red-500 text-black px-2 py-1 my-2 cursor-pointer draggable"
  draggable
  onDragStart={(e) => handleDragStart(e, "hideSprite", {})}
>
  Hide Sprite
</div>

<div
  className="flex flex-row bg-red-500 text-black px-2 py-1 my-2 cursor-pointer draggable"
  draggable
  onDragStart={(e) => handleDragStart(e, "showSprite", {})}
>
  Show Sprite
</div>
      <button
        onClick={handleAddSprite}
        className="bg-green-500 text-white px-4 py-2 my-4"
      >
        Add New Sprite
      </button>
    </div>
  );
}
