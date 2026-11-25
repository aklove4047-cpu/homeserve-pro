package com.homeserve.pro

data class ServiceCategory(
  val id: String,
  val name: String,
  val tagline: String
)

data class HomeServiceItem(
  val id: String,
  val categoryId: String,
  val categoryName: String,
  val name: String,
  val description: String,
  val price: Int,
  val originalPrice: Int?,
  val durationMins: Int,
  val rating: Double,
  val warrantyDays: Int
)

data class CartItem(
  val service: HomeServiceItem,
  val qty: Int
)

data class BookingRecord(
  val bookingCode: String,
  val customerName: String,
  val customerPhone: String,
  val address: String,
  val city: String,
  val scheduledDate: String,
  val scheduledSlot: String,
  val itemsSummary: String,
  val totalAmount: Int,
  val status: String,
  val technicianName: String? = null
)

object FallbackCatalog {
  val categories = listOf(
    ServiceCategory("all", "All", "All services"),
    ServiceCategory("cat-ac", "AC & Cooling", "Service & gas refill"),
    ServiceCategory("cat-tv", "TV Repair", "LED, QLED & wall mount"),
    ServiceCategory("cat-mobile", "Mobile", "Screen & battery fix"),
    ServiceCategory("cat-laptop", "Laptop & PC", "SSD, OS & thermal"),
    ServiceCategory("cat-appliance", "Appliances", "Washer & fridge"),
    ServiceCategory("cat-electrician", "Electrician", "Wiring, MCB & fan"),
    ServiceCategory("cat-plumber", "Plumbing", "Taps, leaks & motor"),
    ServiceCategory("cat-cleaning", "Cleaning", "Home & sofa spa"),
    ServiceCategory("cat-carpenter", "Carpentry", "Locks & furniture"),
    ServiceCategory("cat-painting", "Painting", "Walls & waterproofing"),
    ServiceCategory("cat-pest", "Pest Control", "Cockroach & termite"),
    ServiceCategory("cat-ro", "RO & Chimney", "Filters & deep clean")
  )

  val services = listOf(
    HomeServiceItem("srv-ac-1", "cat-ac", "AC & Cooling", "Foam-Jet AC Service (Split)", "2X deeper indoor & outdoor jet cleaning.", 599, 899, 60, 4.9, 30),
    HomeServiceItem("srv-ac-2", "cat-ac", "AC & Cooling", "AC Gas Refill & Leak Fix", "Complete R32/R410A refill with nitrogen test.", 2499, 3200, 90, 4.8, 60),
    HomeServiceItem("srv-tv-1", "cat-tv", "TV Repair", "LED / Smart TV Inspection & Repair", "Fix no-display, backlight or sound issues.", 349, 599, 45, 4.8, 45),
    HomeServiceItem("srv-tv-2", "cat-tv", "TV Repair", "TV Wall Mount Installation", "Laser-leveled wall mount up to 65 inch.", 499, 799, 45, 4.9, 30),
    HomeServiceItem("srv-mob-1", "cat-mobile", "Mobile", "Doorstep Mobile Screen Replacement", "OEM-grade display swap in 30 mins.", 1999, 2799, 30, 4.9, 90),
    HomeServiceItem("srv-mob-2", "cat-mobile", "Mobile", "Mobile Battery Replacement", "Zero-cycle battery replacement at home.", 999, 1499, 30, 4.8, 90),
    HomeServiceItem("srv-lap-1", "cat-laptop", "Laptop & PC", "Laptop Deep Clean & Thermal Paste", "Fix overheating & loud fan noise.", 699, 999, 60, 4.9, 30),
    HomeServiceItem("srv-lap-2", "cat-laptop", "Laptop & PC", "NVMe SSD Upgrade & Windows Setup", "10X faster boot with data migration.", 899, 1299, 60, 4.9, 60),
    HomeServiceItem("srv-app-1", "cat-appliance", "Appliances", "Washing Machine Repair", "Fix drum spin, drain & error codes.", 349, 549, 60, 4.8, 30),
    HomeServiceItem("srv-elec-2", "cat-electrician", "Electrician", "MCB, Switchboard & Inverter Wiring", "Fix tripping breakers & inverter setup.", 299, 499, 45, 4.8, 30),
    HomeServiceItem("srv-plm-1", "cat-plumber", "Plumbing", "Tap, Mixer & Flush Tank Repair", "Stop dripping taps & cistern leaks.", 199, 349, 30, 4.8, 30),
    HomeServiceItem("srv-cln-1", "cat-cleaning", "Cleaning", "Full Home Deep Cleaning (2BHK)", "Machine scrubbing & kitchen degreasing.", 2999, 3999, 240, 4.9, 7),
    HomeServiceItem("srv-crp-1", "cat-carpenter", "Carpentry", "Door Lock & Wardrobe Repair", "Fix misaligned doors, hinges & locks.", 249, 399, 45, 4.8, 30),
    HomeServiceItem("srv-pst-1", "cat-pest", "Pest Control", "Cockroach & Ant Gel Treatment", "Odorless gel & herbal spray (90d warranty).", 899, 1299, 45, 4.9, 90),
    HomeServiceItem("srv-ro-1", "cat-ro", "RO & Chimney", "RO Purifier Filter Service", "Sediment, carbon & TDS calibration.", 499, 799, 45, 4.8, 30)
  )
}
