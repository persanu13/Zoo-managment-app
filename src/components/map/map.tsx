"use client";
import { useEffect, useRef, useState } from "react";
import {
  Circle,
  Layer,
  Line,
  Stage,
  Text,
  Arc,
  Group,
  Wedge,
} from "react-konva";
import {
  calculateBoundingBox,
  getHabitatColor,
  polygonCentroid,
} from "../map/utility";
import { Vector2d } from "konva/lib/types";
import { Card } from "../ui/card";
import { HabitatsData } from "../../../prisma/migrations/habitats-data";
import { Habitat } from "@/generated/prisma/client";

const MAP = {
  perimeterPoints: [
    56, 23, 1, 8, 21, 156, 87, 161, 100, 226, 246, 208, 300, 74, 197, 10, 151,
    1, 142, 25, 69, 11,
  ],
  entrence: { x: 175, y: 222 },
};

const SCALE_FACTOR = 10;
const PADDING = 50;
const MAX_SCALE = 1;

export default function Map() {
  //refs
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  //states
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [tooltipText, setTooltipText] = useState("");
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const boundingBox = calculateBoundingBox(MAP.perimeterPoints);

  //functions

  const updateScale = (scale: number | null) => {
    const stage = stageRef.current;

    const mapWidthRaw = boundingBox.width * SCALE_FACTOR;
    const mapHeightRaw = boundingBox.height * SCALE_FACTOR;
    const paddingRaw = PADDING * 2 * SCALE_FACTOR;

    const MIN_SCALE = Math.max(
      stage.width() / (mapWidthRaw + paddingRaw),
      stage.height() / (mapHeightRaw + paddingRaw),
    );

    const newScale = Math.min(
      MAX_SCALE,
      Math.max(MIN_SCALE, scale ? scale : MIN_SCALE * 2),
    );

    stage.scale({ x: newScale, y: newScale });
    return newScale;
  };

  const updatePosition = (newPos: { x: number; y: number }) => {
    const stage = stageRef.current;
    if (!stage) return;
    const scale = stage.scaleX();
    const mapWidth = boundingBox.width * SCALE_FACTOR * scale;
    const mapHeight = boundingBox.height * SCALE_FACTOR * scale;

    const padding = PADDING * SCALE_FACTOR * scale;

    const minX = -(mapWidth - stage.width() + padding);
    const maxX = -(0 - padding);
    const minY = -(mapHeight - stage.height() + padding);
    const maxY = -(0 - padding);

    stage.position({
      x: Math.max(minX, Math.min(maxX, newPos.x)),
      y: Math.max(minY, Math.min(maxY, newPos.y)),
    });
    return stage.position();
  };

  const updateSize = () => {
    if (!containerRef.current) return;
    const stage = stageRef.current;
    if (!stage) return;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    stage.width(containerWidth);
    stage.height(containerHeight);

    updateScale(stage.scaleX());
    updatePosition(stage.position());
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    let direction = e.evt.deltaY > 0 ? -1 : 1;

    const scaleBy = 1.1;
    const unclampedScale =
      direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    const newScale = updateScale(unclampedScale);

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    updatePosition(newPos);
  };

  const handleDragBound = (pos: Vector2d) => {
    return updatePosition(pos);
  };

  const centerEntrance = () => {
    const entranceX = MAP.entrence.x * SCALE_FACTOR;
    const entranceY = MAP.entrence.y * SCALE_FACTOR;

    const stage = stageRef.current;
    if (!stage) return;
    updateScale(null);

    const scale = stage.scaleX();
    const x = -entranceX * scale + stage.width() / 2;
    const y = -entranceY * scale + stage.height() / 2;

    updatePosition({ x, y });
  };

  const handleMouseMove = (e: any, habitat: Habitat) => {
    const stage = e.target.getStage();
    const scale = stage.scaleX();
    const pos = stage.getPointerPosition();
    setTooltipPos({
      x: pos.x * scale,
      y: pos.y * scale,
    });
    setTooltipText(habitat.name);
    setTooltipVisible(true);
  };

  const handleMouseOut = () => {
    setTooltipVisible(false);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    updateSize();
    centerEntrance();
    return () => observer.disconnect();
  }, []);

  return (
    <div className=" w-full  flex-1  min-h-0 relative max-w-240 max-h-160">
      <Card className="  w-full h-full bg-[#BAC737]" ref={containerRef}>
        <Stage
          draggable
          ref={stageRef}
          onWheel={handleWheel}
          dragBoundFunc={handleDragBound}
        >
          <Layer>
            <Line
              points={MAP.perimeterPoints.map((p: number) => p * SCALE_FACTOR)}
              stroke="#F6FFF4"
              strokeWidth={20}
              fill="#FAF3E1"
              closed
              tension={0.1}
            />
            <Arc
              x={MAP.entrence.x * SCALE_FACTOR}
              y={MAP.entrence.y * SCALE_FACTOR}
              innerRadius={0} // Fără gaură interioară
              outerRadius={100}
              angle={180} // Jumătate de cerc (în grade)
              fill="#CDB885"
              stroke="#111F35"
              strokeWidth={10}
              rotation={-6}
            />
            <Text
              text="Enterance"
              x={MAP.entrence.x * SCALE_FACTOR}
              y={(MAP.entrence.y + 16) * SCALE_FACTOR}
              rotation={-6}
              width={30 * SCALE_FACTOR}
              height={20 * SCALE_FACTOR}
              offsetX={12 * SCALE_FACTOR}
              offsetY={12 * SCALE_FACTOR}
              align="center"
              verticalAlign="middle"
              fontSize={6 * SCALE_FACTOR}
              fontFamily="'Roboto', 'Arial', sans-serif"
              fontStyle="bold"
              fill="#111F35"
            />
            {HabitatsData.map((habitat) => {
              const center = polygonCentroid(habitat.coordinates);

              return (
                <Group
                  key={habitat.id}
                  onMouseMove={(e) => handleMouseMove(e, habitat)}
                  onMouseOut={handleMouseOut}
                >
                  <Line
                    points={habitat.coordinates.map(
                      (p: number) => p * SCALE_FACTOR,
                    )}
                    fill={habitat.color!}
                    strokeWidth={10}
                    stroke="#111F35"
                    closed
                    tension={0.1}
                  />
                  <Group
                    x={center.x * SCALE_FACTOR}
                    y={(center.y + 4) * SCALE_FACTOR}
                  >
                    <Wedge
                      radius={13 * SCALE_FACTOR}
                      angle={60}
                      fill="#F8FAE6"
                      rotation={-120}
                    />
                    <Circle
                      radius={7 * SCALE_FACTOR}
                      fill={getHabitatColor(habitat.type)}
                      strokeWidth={1 * SCALE_FACTOR}
                      stroke="#F8FAE6"
                      y={-15 * SCALE_FACTOR}
                    />

                    <Text
                      text={habitat.number.toString()}
                      width={24 * SCALE_FACTOR}
                      height={24 * SCALE_FACTOR}
                      offsetX={12 * SCALE_FACTOR}
                      offsetY={12 * SCALE_FACTOR}
                      y={-15 * SCALE_FACTOR}
                      align="center"
                      verticalAlign="middle"
                      fontSize={7 * SCALE_FACTOR}
                      fontFamily="'Roboto', 'Arial', sans-serif"
                      fontStyle="bold"
                      fill="#F8FAE6"
                    />
                  </Group>
                </Group>
              );
            })}
          </Layer>
        </Stage>
      </Card>
      <div className="absolute bottom-0 left-0"></div>
    </div>
  );
}
