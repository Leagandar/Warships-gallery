interface Vehicle {
    title: string;
    description: string;
    icons: {
        large: string;
    };
    level: number;
    type: {
        name: string;
        title: string;
    };
    nation: {
        name: string;
        title: string;
    };
}

interface VehiclesData {
    vehicles: Vehicle[];
}


export type { Vehicle, VehiclesData }