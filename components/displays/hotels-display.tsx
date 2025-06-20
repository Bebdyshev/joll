"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  Hotel,
  MapPin,
  Star,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Waves,
  Coffee,
  Shield,
  Calendar,
  Users,
  Loader2,
  CheckCircle2,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Phone,
  ExternalLink,
  Snowflake,
  Wind,
  Tv,
  Bath,
  Bed,
  Dog,
  Baby,
  Cigarette,
  Zap,
  Shirt,
  Clock,
  Sun,
  TreePine,
  Gamepad2,
  Music,
  Camera,
  Banknote,
  Plane,
  UserCheck,
} from "lucide-react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface HotelProperty {
  name: string
  type: string
  hotel_class: string | null
  link: string
  overall_rating: number | null
  rate_per_night: number | null
  total_rate: number | null
  currency: string
  coordinates?: { latitude: number; longitude: number }
  check_in?: string | null
  check_out?: string | null
  amenities?: string[]
  images?: string[]
}

interface HotelsAPIResponse {
  search_parameters: {
    query: string
    check_in_date: string
    check_out_date: string
    adults: number
    currency: string
  }
  total_results: number
  properties: HotelProperty[]
}

interface HotelDisplayProps {
  toolOutput: HotelsAPIResponse
  bookedIds?: Set<string>
  onBooked?: (item: any, id: string, type: string) => void
}

// Hotel Image Gallery Component
const HotelImageGallery = ({ images, hotelName }: { images: string[]; hotelName: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-xl flex items-center justify-center">
        <Hotel className="h-16 w-16 text-slate-400" />
      </div>
    )
  }

  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${hotelName} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          onLoad={() => setIsLoading(false)}
        />
      </AnimatePresence>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      {/* Image Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1">
          {images.map((_: string, index: number) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation()
                setCurrentIndex(index)
              }}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* Favorite & Share Buttons */}
      <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2">
          <Heart className="h-4 w-4" />
        </button>
        <button className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2">
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Amenity Icon Mapping - Expanded with more variety
const getAmenityIcon = (amenity: string) => {
  const amenityLower = amenity.toLowerCase()
  
  // Internet & Technology
  if (amenityLower.includes("wifi") || amenityLower.includes("internet") || amenityLower.includes("wireless")) 
    return <Wifi className="h-4 w-4" />
  if (amenityLower.includes("tv") || amenityLower.includes("television") || amenityLower.includes("cable")) 
    return <Tv className="h-4 w-4" />
  
  // Transportation & Parking
  if (amenityLower.includes("parking") || amenityLower.includes("car") || amenityLower.includes("garage")) 
    return <Car className="h-4 w-4" />
  if (amenityLower.includes("airport") || amenityLower.includes("shuttle") || amenityLower.includes("transfer")) 
    return <Plane className="h-4 w-4" />
  
  // Dining & Food
  if (amenityLower.includes("restaurant") || amenityLower.includes("dining")) 
    return <Utensils className="h-4 w-4" />
  if (amenityLower.includes("breakfast") || amenityLower.includes("coffee") || amenityLower.includes("cafe")) 
    return <Coffee className="h-4 w-4" />
  if (amenityLower.includes("bar") || amenityLower.includes("lounge") || amenityLower.includes("pub")) 
    return <Utensils className="h-4 w-4" />
  if (amenityLower.includes("room service") || amenityLower.includes("kitchen") || amenityLower.includes("kitchenette")) 
    return <Utensils className="h-4 w-4" />
  
  // Fitness & Recreation
  if (amenityLower.includes("fitness") || amenityLower.includes("gym") || amenityLower.includes("exercise")) 
    return <Dumbbell className="h-4 w-4" />
  if (amenityLower.includes("pool") || amenityLower.includes("swimming") || amenityLower.includes("spa") || amenityLower.includes("jacuzzi")) 
    return <Waves className="h-4 w-4" />
  if (amenityLower.includes("sauna") || amenityLower.includes("steam")) 
    return <Sun className="h-4 w-4" />
  if (amenityLower.includes("game") || amenityLower.includes("entertainment") || amenityLower.includes("arcade")) 
    return <Gamepad2 className="h-4 w-4" />
  if (amenityLower.includes("music") || amenityLower.includes("piano") || amenityLower.includes("karaoke")) 
    return <Music className="h-4 w-4" />
  
  // Room Amenities
  if (amenityLower.includes("air conditioning") || amenityLower.includes("ac") || amenityLower.includes("climate")) 
    return <Snowflake className="h-4 w-4" />
  if (amenityLower.includes("heating") || amenityLower.includes("heat")) 
    return <Zap className="h-4 w-4" />
  if (amenityLower.includes("bath") || amenityLower.includes("bathroom") || amenityLower.includes("shower")) 
    return <Bath className="h-4 w-4" />
  if (amenityLower.includes("bed") || amenityLower.includes("bedroom") || amenityLower.includes("suite")) 
    return <Bed className="h-4 w-4" />
  if (amenityLower.includes("balcony") || amenityLower.includes("terrace") || amenityLower.includes("patio")) 
    return <Wind className="h-4 w-4" />
  
  // Services
  if (amenityLower.includes("laundry") || amenityLower.includes("dry cleaning") || amenityLower.includes("washing")) 
    return <Shirt className="h-4 w-4" />
  if (amenityLower.includes("concierge") || amenityLower.includes("reception") || amenityLower.includes("front desk")) 
    return <Clock className="h-4 w-4" />
  if (amenityLower.includes("luggage") || amenityLower.includes("storage") || amenityLower.includes("baggage")) 
    return <Users className="h-4 w-4" />
  if (amenityLower.includes("currency") || amenityLower.includes("exchange") || amenityLower.includes("atm")) 
    return <Banknote className="h-4 w-4" />
  if (amenityLower.includes("credit card") || amenityLower.includes("payment")) 
    return <CreditCard className="h-4 w-4" />
  
  // Accessibility & Special Needs
  if (amenityLower.includes("accessible") || amenityLower.includes("wheelchair") || amenityLower.includes("disability")) 
    return <UserCheck className="h-4 w-4" />
  if (amenityLower.includes("pet") || amenityLower.includes("dog") || amenityLower.includes("animal")) 
    return <Dog className="h-4 w-4" />
  if (amenityLower.includes("baby") || amenityLower.includes("crib") || amenityLower.includes("children")) 
    return <Baby className="h-4 w-4" />
  if (amenityLower.includes("smoking") || amenityLower.includes("cigarette")) 
    return <Cigarette className="h-4 w-4" />
  
  // Outdoor & Nature
  if (amenityLower.includes("garden") || amenityLower.includes("park") || amenityLower.includes("nature")) 
    return <TreePine className="h-4 w-4" />
  if (amenityLower.includes("beach") || amenityLower.includes("ocean") || amenityLower.includes("sea")) 
    return <Waves className="h-4 w-4" />
  if (amenityLower.includes("view") || amenityLower.includes("scenic") || amenityLower.includes("photography")) 
    return <Camera className="h-4 w-4" />
  
  // Default icon for unmatched amenities
  return <Shield className="h-4 w-4" />
}

// Enhanced Hotel Card Component - Compact version to match ticket cards
const HotelCard = ({ hotel, searchParams, onBook, isBooked, isBooking }: any) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: hotel.currency || "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_: undefined, i: number) => (
          <Star
            key={i}
            className={`h-2.5 w-2.5 md:h-3 md:w-3 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
          />
        ))}
        <span className="text-[9px] md:text-xs text-slate-600 dark:text-slate-300 ml-1">{rating.toFixed(1)}</span>
      </div>
    )
  }

  const calculateNights = () => {
    const checkIn = new Date(searchParams.check_in_date)
    const checkOut = new Date(searchParams.check_out_date)
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
  }

  const nights = calculateNights()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Card
            className={`relative overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
              isBooked
                ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                : "border-slate-200 dark:border-slate-700 hover:border-purple-300 hover:shadow-xl"
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600" />

            {/* Compact Hotel Image */}
            {hotel.images && hotel.images.length > 0 ? (
              <div className="h-20 md:h-24 w-full overflow-hidden">
                <img 
                  src={hotel.images[0]} 
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-20 md:h-24 w-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                <Hotel className="h-6 w-6 md:h-8 md:w-8 text-slate-400" />
              </div>
            )}

            <CardHeader className="p-2 md:p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 md:space-x-2 min-w-0">
                  <div className="p-1 md:p-2 bg-purple-100 dark:bg-purple-900 rounded-lg flex-shrink-0">
                    <Hotel className="h-4 w-4 md:h-5 md:w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xs md:text-sm lg:text-base xl:text-lg font-bold text-slate-900 dark:text-white truncate">
                      {hotel.name}
                    </CardTitle>
                    <p className="text-[9px] md:text-[10px] lg:text-xs text-slate-500 dark:text-slate-400 truncate">
                      {hotel.hotel_class || hotel.type}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-sm md:text-lg lg:text-xl font-bold text-slate-900 dark:text-white">{formatPrice(hotel.rate_per_night)}</div>
                  <div className="text-[8px] md:text-[9px] lg:text-[10px] text-slate-500 dark:text-slate-400">per night</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 p-2 md:p-3">
              <div className="space-y-2 md:space-y-3">
                {/* Rating */}
                {hotel.overall_rating && (
                  <div className="flex items-center justify-between">
                    {renderStars(hotel.overall_rating)}
                  </div>
                )}

                {/* Amenities Preview - Compact */}
                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div className="flex items-center space-x-1 overflow-hidden">
                    {hotel.amenities.slice(0, 3).map((amenity: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-full px-1.5 md:px-2 py-1"
                      >
                        {getAmenityIcon(amenity)}
                      </div>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <span className="text-[9px] md:text-xs text-slate-500 dark:text-slate-400">+{hotel.amenities.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Duration info */}
                <div className="flex items-center justify-between text-[8px] md:text-[9px] lg:text-[10px] text-slate-500 dark:text-slate-400">
                  <span>{nights} nights</span>
                  <span>Total: {formatPrice(hotel.total_rate)}</span>
                </div>

                {isBooked && (
                  <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="text-xs md:text-sm font-medium">Booked</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </DialogTrigger>

      {/* Detailed Hotel Dialog */}
      <DialogContent className="sm:max-w-[90vw] md:max-w-4xl max-h-[90vh] overflow-y-auto mx-2 md:mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Hotel className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-xl font-bold">{hotel.name}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-normal flex items-center space-x-2">
                {hotel.hotel_class && <span>{hotel.hotel_class}</span>}
                {hotel.overall_rating && (
                  <>
                    <span>•</span>
                    {renderStars(hotel.overall_rating)}
                  </>
                )}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Enhanced Image Gallery */}
          <div className="relative">
            <HotelImageGallery images={hotel.images || []} hotelName={hotel.name} />
          </div>

          {/* Booking Summary */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                  <Calendar className="h-4 w-4" />
                  <span>Check-in</span>
                </div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {new Date(searchParams.check_in_date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                {hotel.check_in && <div className="text-sm text-slate-500">{hotel.check_in}</div>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                  <Calendar className="h-4 w-4" />
                  <span>Check-out</span>
                </div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {new Date(searchParams.check_out_date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                {hotel.check_out && <div className="text-sm text-slate-500">{hotel.check_out}</div>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                  <Users className="h-4 w-4" />
                  <span>Guests</span>
                </div>
                <div className="font-semibold text-slate-900 dark:text-white">{searchParams.adults} Adults</div>
                <div className="text-sm text-slate-500">{nights} nights</div>
              </div>
            </div>
          </div>

          {/* Amenities Grid */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Hotel Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {hotel.amenities.map((amenity: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700"
                  >
                    {getAmenityIcon(amenity)}
                    <span className="text-sm text-slate-700 dark:text-slate-300">{amenity}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Location & Contact */}
          {hotel.coordinates && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Location & Contact</h3>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {hotel.coordinates.latitude.toFixed(4)}, {hotel.coordinates.longitude.toFixed(4)}
                  </span>
                </div>
                <div className="flex space-x-4">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Call Hotel</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4" />
                    <span>View on Map</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between w-full">
            <div className="text-left">
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{formatPrice(hotel.total_rate)}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {formatPrice(hotel.rate_per_night)} × {nights} nights
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => onBook?.(hotel, "hotels")}
              disabled={isBooking || isBooked}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isBooking ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Booking...
                </>
              ) : isBooked ? (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Booked
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Book Hotel
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function HotelDisplay({ toolOutput, bookedIds = new Set(), onBooked }: HotelDisplayProps) {
  const [bookingStates, setBookingStates] = useState<Record<string, boolean>>({})
  const [sortBy, setSortBy] = useState<"price" | "rating" | "name">("price")
  const { toast } = useToast()

  const handleBooking = async (hotel: any, type: string) => {
    const itemId = hotel.link || `${hotel.name}-${Date.now()}`
    setBookingStates((prev) => ({ ...prev, [itemId]: true }))

    try {
      // Simulate booking API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Hotel Booked Successfully! 🏨",
        description: `${hotel.name} has been reserved for your stay.`,
      })

      onBooked?.(hotel, itemId, type)
    } catch (error) {
      console.error("Booking error:", error)
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setBookingStates((prev) => ({ ...prev, [itemId]: false }))
    }
  }

  // Sort hotels
  const sortedHotels = [...toolOutput.properties].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return (a.rate_per_night || 0) - (b.rate_per_night || 0)
      case "rating":
        return (b.overall_rating || 0) - (a.overall_rating || 0)
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  return (
    <div className="mt-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="p-1.5 md:p-2 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg">
              <Hotel className="h-5 w-5 md:h-6 md:w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                Hotels in {toolOutput.search_parameters.query}
              </h3>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                {toolOutput.total_results.toLocaleString()} properties found
              </p>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-1 md:space-x-2 w-full sm:w-auto">
            <span className="text-xs md:text-sm text-slate-600 dark:text-slate-300 flex-shrink-0">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs md:text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-2 md:px-3 py-1 bg-white dark:bg-slate-800 flex-1 sm:flex-none min-w-0"
            >
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4">
          <AnimatePresence>
            {sortedHotels.slice(0, 9).map((hotel: HotelProperty, index: number) => {
              const itemId = hotel.link || `${hotel.name}-${index}`
              const isBooked = bookedIds.has(itemId)
              const isBooking = bookingStates[itemId] || false

              return (
                <motion.div
                  key={itemId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <HotelCard
                    hotel={hotel}
                    searchParams={toolOutput.search_parameters}
                    onBook={handleBooking}
                    isBooked={isBooked}
                    isBooking={isBooking}
                  />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {toolOutput.properties.length > 9 && (
          <div className="text-center">
            <Button
              variant="ghost"
              className="text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950 text-xs md:text-sm"
            >
              View {toolOutput.properties.length - 9} more hotels
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
