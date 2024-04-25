export type Stock = {
  _id: string
  product: { _id: string }
  quantity: number
}

export type StockDictionary = {
  [key: string]: number;
}