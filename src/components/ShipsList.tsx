import { useQuery } from "@apollo/client";
import { CSSProperties, ChangeEvent, memo, useMemo, useState } from "react";
import ReactVirtualizedAutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeGrid as Grid } from "react-window";
import { GET_VEHICLES } from "../API";
import { Vehicle, VehiclesData } from "../types";

interface GridData {
  columnCount: number;
  items: Vehicle[];
}

interface GridItemProps {
  columnIndex: number;
  rowIndex: number;
  style: CSSProperties;
  data: GridData;
}

interface Filters {
  level: number | null;
  nation: string | null;
  type: string | null;
}

const SHIP_CARD_PADDING = 8;

const GridItem = ({ columnIndex, rowIndex, style, data }: GridItemProps) => {
  const { columnCount, items } = data;
  const index = rowIndex * columnCount + columnIndex;
  const vehicle = items[index];

  if (!vehicle) return <div style={style} />;

  const itemStyle: CSSProperties = {
    ...style,
    width: +(style.width ?? 0) - SHIP_CARD_PADDING * 2,
    height: +(style.height ?? 0) - SHIP_CARD_PADDING * 2,
  };

  return (
    <div
      key={vehicle.title}
      className="border p-4 rounded bg-black overflow-hidden flex flex-col gap-y-1"
      style={itemStyle}
    >
      <img src={vehicle.icons.large} alt={vehicle.title} className="mb-2" />
      <h2 className="text-xl font-bold text-white">{vehicle.title}</h2>
      <div
        className="text-gray-300 overflow-hidden overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {vehicle.description}
      </div>
      <p className="text-gray-400">Level: {vehicle.level}</p>
      <p className="text-gray-400">Nation: {vehicle.nation.title}</p>
      <p className="text-gray-400">Type: {vehicle.type.title}</p>
    </div>
  );
};

const ShipsList = memo(() => {
  const { loading, error, data } = useQuery<VehiclesData>(GET_VEHICLES);
  const [filters, setFilters] = useState<Filters>({
    level: null,
    nation: null,
    type: null,
  });

  const { levels, nations, types } = useMemo(() => {
    const levels = new Set<number>();
    const nations = new Map<string, string>();
    const types = new Map<string, string>();

    data?.vehicles.forEach((vehicle) => {
      if (vehicle.title && vehicle.description) {
        levels.add(vehicle.level);
        nations.set(vehicle.nation.name, vehicle.nation.title);
        types.set(vehicle.type.name, vehicle.type.title);
      }
    });

    return { levels, nations, types };
  }, [data?.vehicles]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const handleFilterChange = (
    e: ChangeEvent<HTMLSelectElement>,
    key: string
  ) => {
    setFilters({
      ...filters,
      [key]: key === "level" ? parseInt(e.target.value) : e.target.value,
    });
  };

  const filteredData =
    data?.vehicles.filter((vehicle) => {
      return (
        vehicle.title.trim() &&
        vehicle.description.trim() &&
        (!filters.level || vehicle.level === filters.level) &&
        (!filters.nation || vehicle.nation.name === filters.nation) &&
        (!filters.type || vehicle.type.name === filters.type)
      );
    }) || [];

  const levelOptions = Array.from(levels)
    .sort((a, b) => a - b)
    .map((level) => (
      <option key={level} value={level}>{`Level ${level}`}</option>
    ));

  const nationsOptions = Array.from(nations.entries()).map(([name, title]) => (
    <option key={name} value={name}>
      {title}
    </option>
  ));

  const typeOptions = Array.from(types.entries()).map(([name, title]) => (
    <option key={name} value={name}>
      {title}
    </option>
  ));

  return (
    <div className="container mx-auto py-8 h-full overflow-hidden flex flex-col">
      <h1 className="text-2xl font-bold mb-4 text-white">World of Warships</h1>
      <div className="mb-4 flex space-x-2">
        <select
          className="px-3 py-2 border rounded bg-white text-black"
          onChange={(e) => handleFilterChange(e, "level")}
        >
          <option value="">All Levels</option>
          {levelOptions}
        </select>
        <select
          className="px-3 py-2 border rounded bg-white text-black"
          onChange={(e) => handleFilterChange(e, "nation")}
        >
          <option value="">All Nations</option>
          {nationsOptions}
        </select>
        <select
          className="px-3 py-2 border rounded bg-white text-black"
          onChange={(e) => handleFilterChange(e, "type")}
        >
          <option value="">All Types</option>
          {typeOptions}
        </select>
      </div>
      <div className="flex-1">
        <ReactVirtualizedAutoSizer>
          {({ height, width }) => {
            const columnWidth = 300;
            const rowHeight = 700;
            const columnCount = Math.floor(width / columnWidth);
            const rowCount = Math.ceil(filteredData.length / columnCount);

            return (
              <Grid
                columnWidth={columnWidth}
                columnCount={columnCount}
                rowHeight={rowHeight}
                rowCount={rowCount}
                height={height}
                width={width}
                itemData={{ columnCount, items: filteredData }}
              >
                {GridItem}
              </Grid>
            );
          }}
        </ReactVirtualizedAutoSizer>
      </div>
    </div>
  );
});

export { ShipsList };
