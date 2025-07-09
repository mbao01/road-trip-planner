export type Stop = {
  id: number
  name: string
  driving: string
  latitude: number
  longitude: number
}

export type Day = {
  id: number
  date: string
  stops: Stop[]
}

export type Trip = {
  id: string
  name: string
  dates: string
  days: Day[]
  status: "active" | "archived"
}

export type Settings = {
  id: string
  tripId: string
  mapStyle: "default" | "outdoors" | "satellite"
  calculateCosts: boolean
  currency: "gbp" | "eur" | "usd"
  fuelCostPerLitre: number
  mpg: number
  avoidTolls: boolean
  avoidMotorways: boolean
  distanceUnit: "mi" | "km"
}

// Type for the data displayed in the trips table
export type TripTableRow = {
  id: string
  name: string
  startDate: string
  endDate: string
  dayCount: number
  stopCount: number
  status: "Not Started" | "In Progress" | "Completed" | "Archived"
  access: "Owner" | "Editor" | "Viewer" | "Public"
}
