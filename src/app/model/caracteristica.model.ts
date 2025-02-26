// models/caracteristica.model.ts
export interface Caracteristica {
    id_caracteristica: number;
    nombre_caracteristica: string;
    // Agrega otros campos según sea necesario
  }
  
  export interface CaracteristicasResponse {
    message: string;
    data: Caracteristica[][];
  }