import { useCallback, useRef } from "react";

const useMoveAction = (previewWidth, previewHeight, spriteSize, setSprites, deepCopySprites, blocks, setBlocks) => {
  const currentPositionRef = useRef({});
  const directionRef = useRef({});

  const constrainPosition = (x, y) => {
    let constrainedX = Math.max(0, Math.min(x, previewWidth - spriteSize));
    let constrainedY = Math.max(0, Math.min(y, previewHeight - spriteSize));
    return { constrainedX, constrainedY };
  };

  const detectCircleRectangleCollision = (circle, rect) => {
    const circleX = circle.x + circle.size / 2;
    const circleY = circle.y + circle.size / 2;
    const radius = circle.size / 2;

    const closestX = Math.max(rect.x, Math.min(circleX, rect.x + rect.size));
    const closestY = Math.max(rect.y, Math.min(circleY, rect.y + rect.size));

    const distanceX = circleX - closestX;
    const distanceY = circleY - closestY;

    return (distanceX ** 2 + distanceY ** 2) < (radius ** 2);
  };

  const detectPolygonCollision = (poly1, poly2) => {
    const getAxes = (polygon) => {
      const axes = [];
      for (let i = 0; i < polygon.length; i++) {
        const p1 = polygon[i];
        const p2 = polygon[(i + 1) % polygon.length];
        const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
        const normal = { x: -edge.y, y: edge.x };
        const length = Math.sqrt(normal.x ** 2 + normal.y ** 2);
        axes.push({ x: normal.x / length, y: normal.y / length });
      }
      return axes;
    };

    const projectPolygon = (axis, polygon) => {
      let min = Infinity;
      let max = -Infinity;
      for (const point of polygon) {
        const projection = point.x * axis.x + point.y * axis.y;
        min = Math.min(min, projection);
        max = Math.max(max, projection);
      }
      return { min, max };
    };

    const polygonsOverlap = (proj1, proj2) => {
      return proj1.max >= proj2.min && proj2.max >= proj1.min;
    };

    const axes1 = getAxes(poly1);
    const axes2 = getAxes(poly2);
    for (const axis of axes1.concat(axes2)) {
      const proj1 = projectPolygon(axis, poly1);
      const proj2 = projectPolygon(axis, poly2);
      if (!polygonsOverlap(proj1, proj2)) {
        return false;
      }
    }
    return true;
  };

  const handleCollision = (sprite1, sprite2) => {
    setSprites((prevSprites) => {
      return prevSprites.map((sprite) => {
        if (sprite.id === sprite1.id || sprite.id === sprite2.id) {
          let offset = 10;
          return {
            ...sprite,
            x: sprite.direction === 1 ? sprite.x - offset : sprite.x + offset,
            y: sprite.direction === 1 ? sprite.y - offset : sprite.y + offset,
            direction: -sprite.direction
          };
        }
        return sprite;
      });
    });
  };

  const detectCollision = (sprite1, sprite2) => {
    const isCircle1 = sprite1.type === 'chicken';
    const isCircle2 = sprite2.type === 'chicken';
    if (isCircle1 && !isCircle2) {
      return detectCircleRectangleCollision(sprite1, sprite2);
    } else if (!isCircle1 && isCircle2) {
      return detectCircleRectangleCollision(sprite2, sprite1);
    }
  
    return detectPolygonCollision(
      [{ x: sprite1.x, y: sprite1.y }, { x: sprite1.x + 40, y: sprite1.y + 20 }],
      [{ x: sprite2.x, y: sprite2.y }, { x: sprite2.x + sprite2.size, y: sprite2.y }]
    );
  };

  const executeRepeatMove = async (sprite, steps, repeatCount) => {
    const direction = steps > 0 ? 1 : -1;
    let remainingSteps = Math.abs(steps) * repeatCount;

    const performStep = () => {
      setSprites((prevSprites) => {
        return prevSprites.map((s) => {
          if (s.id === sprite.id && remainingSteps > 0) {
            const newX = s.x + direction * (steps / Math.abs(steps));
            const { constrainedX } = constrainPosition(newX, s.y);
            remainingSteps--;
            return {
              ...s,
              x: constrainedX,
              direction
            };
          }
          return s;
        });
      });

      if (remainingSteps > 0) {
        requestAnimationFrame(performStep);
      }
    };

    performStep();
  };

  const executeMove = useCallback(
    (sprite, steps) => {
      const direction = steps > 0 ? 1 : -1;
      let distance = Math.abs(steps);
      let stepSize = direction * (steps / distance);

      const animate = () => {
        let collisionOccurred = false;

        setSprites((prevSprites) => {
          const updatedSprites = deepCopySprites();
          updatedSprites.forEach((s) => {
            if (s.id === sprite.id) {
              const newX = s.x + stepSize;
              const { constrainedX } = constrainPosition(newX, s.y);
              s.x = constrainedX;
            }
          });

          const [sprite1, sprite2] = updatedSprites;
          if (sprite1 && sprite2 && detectCollision(sprite1, sprite2)) {
            collisionOccurred = true;
            handleCollision(sprite1, sprite2);
          }

          return updatedSprites;
        });

        if (!collisionOccurred && distance > 0) {
          distance--;
          requestAnimationFrame(animate);
        }
      };

      animate();
    },
    [setSprites, deepCopySprites, constrainPosition, detectCollision, handleCollision]
  );

  return { executeMove, executeRepeatMove, constrainPosition, detectCollision, handleCollision };
};

export default useMoveAction;
