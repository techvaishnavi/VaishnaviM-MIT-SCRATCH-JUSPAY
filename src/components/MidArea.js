import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addBlock, deleteBlock } from '../store/blocksSlice';
import { updateSprite, setLastAction, setTriggerOnClick } from '../store/spritesSlice';
import { selectSprite } from '../store/selectionSlice';
import { startAnimation, stopAnimation } from '../store/animationSlice';
import { ActionCreators as UndoActionCreators } from 'redux-undo';

export default function MidArea() {
  const sprites = useSelector((state) => state.sprites.present || []);
  const blocks = useSelector((state) => state.blocks.present || []);
  const selectedSpriteId = useSelector((state) => state.selection.selectedSpriteId);
  const isAnimating = useSelector((state) => state.animation.isAnimating);
  const repeatState = useSelector((state) => state.repeat?.repeat || {});
  const dispatch = useDispatch();

  const handleDrop = (e) => {
    e.preventDefault();
  
    const actionType = e.dataTransfer.getData("actionType");
    const actionValue = JSON.parse(e.dataTransfer.getData("actionValue") || "{}");
  
    if (selectedSpriteId && actionType) {
      if (actionType === "whenSpriteIsClicked") {
        // Instead of only setting triggerOnClick, also add the block to the list
        const block = {
          id: Date.now(), // Unique ID for the block
          actionType: "triggerOnClick", // Standardize the action type for display
          actionValue,
          spriteId: selectedSpriteId,
        };
        dispatch(addBlock(block));
  
        // Additionally set the trigger action on the sprite if needed
        dispatch(setTriggerOnClick({
          id: selectedSpriteId,
          actionType: "triggerOnClick",
          actionValue,
        }));
      } else {
        // Handle other action types
        const block = {
          id: Date.now(),
          actionType,
          actionValue,
          spriteId: selectedSpriteId,
        };
        dispatch(addBlock(block));
      }
    } else {
      console.warn("Drop failed: No sprite selected or action type is missing.");
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  // Function to execute a block
const executeBlock = async (block) => {
  const { actionType, actionValue, spriteId } = block;
  const sprite = sprites.find((sprite) => sprite.id === spriteId);
  if (!sprite) return;

  switch (actionType) {
    case 'move':
      // Move sprite by the specified number of steps
      dispatch(updateSprite({ id: spriteId, updates: { x: sprite.x + parseInt(actionValue.steps, 10) } }));
      break;
      
    case 'turn':
      // Turn sprite by the specified number of degrees
      dispatch(updateSprite({ id: spriteId, updates: { rotation: sprite.rotation + parseInt(actionValue.degrees, 10) } }));
      break;
      
    case 'goTo':
      // Move sprite to the specified coordinates
      dispatch(updateSprite({ id: spriteId, updates: { x: parseInt(actionValue.x, 10), y: parseInt(actionValue.y, 10) } }));
      break;
      
    case 'repeat':
      // Repeat the last action a specified number of times
      const repeatCount = repeatState[spriteId] || actionValue.times;
      const spriteBlocks = blocks.filter((b) => b.spriteId === spriteId);
      const lastActionIndex = spriteBlocks.indexOf(block) - 1;
      if (lastActionIndex >= 0) {
        const lastAction = spriteBlocks[lastActionIndex];
        for (let i = 0; i < repeatCount; i++) {
          await executeBlock(lastAction);
        }
      }
      break;
      
    case 'sayHi':
      // Make the sprite say "Hi"
      dispatch(updateSprite({ id: spriteId, updates: { message: "Hi" } }));
      setTimeout(() => {
        dispatch(updateSprite({ id: spriteId, updates: { message: "" } }));
      }, 2000);
      break;
      
    case 'sayMessage':
      // Display a message for a specified duration
      dispatch(updateSprite({ id: spriteId, updates: { message: actionValue.message } }));
      setTimeout(() => {
        dispatch(updateSprite({ id: spriteId, updates: { message: "" } }));
      }, actionValue.duration * 1000);
      break;
      
    case 'triggerOnClick':
      // Execute the action associated with the sprite's click event
      if (sprite.triggerOnClick) {
        const triggeredBlock = {
          actionType: sprite.triggerOnClick.actionType,
          actionValue: sprite.triggerOnClick.actionValue,
          spriteId: sprite.id,
        };
        await executeBlock(triggeredBlock);
      }
      break;
      
    case 'hideSprite':
      // Hide the sprite
      dispatch(updateSprite({ id: spriteId, updates: { visible: false } }));
      break;
      
    case 'showSprite':
      // Show the sprite
      dispatch(updateSprite({ id: spriteId, updates: { visible: true } }));
      break;
      
    default:
      console.warn(`Unknown action type: ${actionType}`);
      break;
  }
  
  // Update the last action performed for the sprite
  dispatch(setLastAction({ id: spriteId, actionType, actionValue }));
};

  
  const runAllActions = async () => {
    if (isAnimating) return;
    dispatch(startAnimation());

    await Promise.all(sprites.map(async (sprite) => {
      const spriteBlocks = blocks.filter((block) => block.spriteId === sprite.id);
      for (const block of spriteBlocks) {
        await executeBlock(block);
      }
    }));

    dispatch(stopAnimation());
  };


  const deleteBlockById = (blockId) => {
    dispatch(deleteBlock(blockId));
  };

  
  const handleUndo = () => {
    dispatch(UndoActionCreators.undo());
  };

  const handleRedo = () => {
    dispatch(UndoActionCreators.redo());
  };

  return (
    <div className="flex-1 h-full p-4 border border-gray-300 relative">
      <button
        className="bg-green-500 text-white px-4 py-2 absolute top-4 right-4"
        onClick={runAllActions}
        disabled={isAnimating}
      >
        Run All Actions
      </button>

      <button className="bg-blue-500 text-white px-4 py-2 mr-2" onClick={handleUndo}>
        Undo
      </button>
      <button className="bg-blue-500 text-white px-4 py-2" onClick={handleRedo}>
        Redo
      </button>

      <h2 className="font-bold text-xl mb-4">MidArea - Drag and Drop Actions Here</h2>

      <div
        className="w-full h-32 border-2 border-dashed border-gray-400 p-4 mb-4 bg-gray-100 rounded-md"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p className="text-gray-500">Drop Motion Blocks Here</p>
      </div>

      <div className="mb-4">
        <label className="font-bold">Select Sprite: </label>
        <select
          className="border border-gray-300 px-2 py-1"
          value={selectedSpriteId || ""}
          onChange={(e) => dispatch(selectSprite(parseInt(e.target.value)))}
        >
          <option value="">Select a Sprite</option>
          {sprites.map((sprite, index) => (
            <option key={sprite.id} value={sprite.id}>
              Sprite {index + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
  {selectedSpriteId ? (
    <div className="mb-4">
      <h3 className="font-semibold text-lg">
        Actions for Sprite {sprites.findIndex(sprite => sprite.id === selectedSpriteId) + 1}:
      </h3>
      {blocks
        .filter((block) => block.spriteId === selectedSpriteId)
        .map((block) => (
          <div key={block.id} className="bg-blue-100 p-2 my-2 rounded-md shadow-md flex justify-between items-center">
            <div>
              <p className="font-semibold">
                {block.actionType === "move"
                  ? `Move ${block.actionValue.steps} steps`
                  : block.actionType === "turn"
                  ? `Turn ${block.actionValue.degrees} degrees`
                  : block.actionType === "goTo"
                  ? `Go to x: ${block.actionValue.x}, y: ${block.actionValue.y}`
                  : block.actionType === "repeat"
                  ? `Repeat ${block.actionValue.times} times`
                  : block.actionType === "sayHi"
                  ? `Say Hi`
                  : block.actionType === "sayMessage"
                  ? `Say "${block.actionValue.message}" for ${block.actionValue.duration} sec`
                  : block.actionType === "hideSprite"
                  ? `Hide Sprite`
                  : block.actionType === "showSprite"
                  ? `Show Sprite`
                  : block.actionType === "triggerOnClick"
                  ? `When Sprite is clicked`
                  : "Unknown Action"}
              </p>
                  </div>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded-md ml-4"
                    onClick={() => deleteBlockById(block.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500">Select a sprite to see its actions</p>
        )}
      </div>
    </div>
  );
}
