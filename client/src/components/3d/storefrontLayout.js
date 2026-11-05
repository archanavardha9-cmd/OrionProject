export function illustrativeStorefrontPosition(index, totalStores = 1) {
  const row = Math.floor(index / 2)
  const firstRowZ = totalStores <= 12 ? -5.5 : -9.5

  return {
    x: index % 2 === 0 ? -3.2 : 3.2,
    y: 0,
    z: firstRowZ + row * 3.45,
  }
}
