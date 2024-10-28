
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CatSprite from './CatSprite';
import ChickenSprite from './ChickenSprite';
import { updateSprite } from '../store/spritesSlice';
import { executeBlock } from './MidArea'; 

export default function PreviewArea() {
  const sprites = useSelector((state) => state.sprites.present);
  const dispatch = useDispatch();

  const constrainPosition = (x, y) => {
    const constrainedX = Math.max(0, Math.min(x, 530 - 100));
    const constrainedY = Math.max(0, Math.min(y, 400 - 100));
    return { constrainedX, constrainedY };
  };

  const handleSpriteClick = (sprite) => {
    if (sprite.triggerOnClick) {
      executeBlock({
        actionType: sprite.triggerOnClick.actionType,
        actionValue: sprite.triggerOnClick.actionValue,
        spriteId: sprite.id,
      });
    }
  };

  return (
    <div className="w-full h-full relative">
      {sprites.map((sprite) => (
        sprite.visible !== false && ( 
          <div
            key={sprite.id}
            style={{
              position: 'absolute',
              top: sprite.y,
              left: sprite.x,
              transform: `rotate(${sprite.rotation}deg)`,
              zIndex: 2,
              width: '100px',
              height: '100px',
            }}
            onClick={() => handleSpriteClick(sprite)}
          >
            {sprite.type === 'cat' ? <CatSprite /> : <ChickenSprite />}
            {sprite.message && (
              <div
                style={{
                  position: 'absolute',
                  top: -20,
                  left: 0,
                  backgroundColor: 'yellow',
                  padding: '5px',
                  borderRadius: '5px',
                  fontSize: '12px',
                }}
              >
                {sprite.message}
              </div>
            )}
          </div>
        )
      ))}
    </div>
  );
  
  
}
