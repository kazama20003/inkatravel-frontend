import { type NextRequest, NextResponse } from "next/server"

interface Location {
  lat: number
  lng: number
}

interface MapRequestBody {
  origin: Location
  destination: Location
  intermediateStops?: Location[]
}

export async function POST(request: NextRequest) {
  try {
    const { origin, destination, intermediateStops }: MapRequestBody = await request.json()

    console.log("[v0] Map API called with:", {
      origin: `${origin.lat},${origin.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      stops: intermediateStops?.length || 0,
    })

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      console.error("[v0] Google Maps API key not found in environment variables")
      return NextResponse.json({ error: "Google Maps API key not configured" }, { status: 500 })
    }

    console.log("[v0] API key found, length:", apiKey.length)

    const baseUrl = "https://maps.googleapis.com/maps/api/staticmap"
    const size = "800x400"
    const maptype = "roadmap"
    const scale = "2"

    const markers = [
      `color:0x27ae60|label:A|size:mid|${origin.lat},${origin.lng}`,
      `color:0xe67e22|label:B|size:mid|${destination.lat},${destination.lng}`,
    ]

    if (intermediateStops && intermediateStops.length > 0) {
      intermediateStops.forEach((stop: Location, index: number) => {
        markers.push(`color:0xf1c40f|label:${index + 1}|size:small|${stop.lat},${stop.lng}`)
      })
    }

    const pathPoints = [
      `${origin.lat},${origin.lng}`,
      ...(intermediateStops?.map((stop: Location) => `${stop.lat},${stop.lng}`) || []),
      `${destination.lat},${destination.lng}`,
    ]

    const path = `color:0x2c3e50|weight:4|${pathPoints.join("|")}`

    const params = new URLSearchParams({
      size,
      maptype,
      scale,
      key: apiKey,
      path,
      format: "png",
      language: "es",
      region: "PE",
    })

    markers.forEach((marker) => {
      params.append("markers", marker)
    })

    const staticMapUrl = `${baseUrl}?${params.toString()}`

    console.log("[v0] Generated map URL (first 100 chars):", staticMapUrl.substring(0, 100) + "...")

    try {
      const testResponse = await fetch(staticMapUrl, { method: "HEAD" })
      console.log("[v0] Map URL test response status:", testResponse.status)

      if (!testResponse.ok) {
        console.error("[v0] Google Maps API returned error:", testResponse.status, testResponse.statusText)
        return NextResponse.json(
          {
            error: `Google Maps API error: ${testResponse.status} ${testResponse.statusText}`,
          },
          { status: 500 },
        )
      }
    } catch (testError) {
      console.error("[v0] Error testing map URL:", testError)
      return NextResponse.json(
        {
          error: "Error validating map URL",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ mapUrl: staticMapUrl })
  } catch (error) {
    console.error("[v0] Error generating map URL:", error)
    return NextResponse.json({ error: "Failed to generate map URL" }, { status: 500 })
  }
}
