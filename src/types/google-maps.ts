export interface GoogleMapsDirectionsLeg {
  distance?: {
    value: number
    text: string
  }
  duration?: {
    value: number
    text: string
  }
  start_address: string
  end_address: string
  start_location: {
    lat: () => number
    lng: () => number
  }
  end_location: {
    lat: () => number
    lng: () => number
  }
}

export interface GoogleMapsDirectionsRoute {
  legs: GoogleMapsDirectionsLeg[]
  overview_path: Array<{ lat: () => number; lng: () => number }>
  overview_polyline: string
  summary: string
  warnings: string[]
  waypoint_order: number[]
}

export interface GoogleMapsDirectionsResult {
  routes: GoogleMapsDirectionsRoute[]
  request: {
    origin: { lat: number; lng: number }
    destination: { lat: number; lng: number }
    travelMode: string
  }
}

export type GoogleMapsDirectionsStatus =
  | "OK"
  | "NOT_FOUND"
  | "ZERO_RESULTS"
  | "MAX_WAYPOINTS_EXCEEDED"
  | "MAX_ROUTE_LENGTH_EXCEEDED"
  | "INVALID_REQUEST"
  | "OVER_DAILY_LIMIT"
  | "OVER_QUERY_LIMIT"
  | "REQUEST_DENIED"
  | "UNKNOWN_ERROR"

export interface GoogleMapsWaypoint {
  location: { lat: number; lng: number }
  stopover: boolean
}

export interface GoogleMapsAdvancedMarker {
  position: { lat: number; lng: number }
  map: unknown
  title?: string
  content?: HTMLElement
}

export interface GoogleMapInstance {
  setCenter?: (center: { lat: number; lng: number }) => void
  setZoom?: (zoom: number) => void
  panTo?: (position: { lat: number; lng: number }) => void
}
