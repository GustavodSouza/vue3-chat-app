export const converterObjetoEmArray = (objeto) => {
  return Object.entries(objeto).map(([uid, value]) => ({
    ...(typeof value === "object" && value !== null ? value : {}),
    uid 
  }));
}