export function crearSlug(nombre: string): string {
    return nombre
      .toLowerCase()
      .normalize("NFD") // quitar acentos
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, '-');
  }
  