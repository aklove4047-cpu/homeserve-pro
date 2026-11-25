package com.homeserve.pro

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.homeserve.pro.ui.theme.HomeServeProTheme
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()
    setContent {
      HomeServeProTheme {
        HomeServeApp()
      }
    }
  }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeServeApp() {
  val scope = rememberCoroutineScope()
  var selectedTab by remember { mutableIntStateOf(0) }
  var serverUrl by remember { mutableStateOf("https://homeserve-pro.aklove4047.workers.dev") }
  var isOnline by remember { mutableStateOf(false) }

  var services by remember { mutableStateOf(FallbackCatalog.services) }
  var bookings by remember { mutableStateOf<List<BookingRecord>>(emptyList()) }
  var selectedCat by remember { mutableStateOf("all") }
  var searchQuery by remember { mutableStateOf("") }
  var cart by remember { mutableStateOf<List<CartItem>>(emptyList()) }
  var statusMessage by remember { mutableStateOf<String?>(null) }

  fun syncData() {
    scope.launch {
      try {
        val remoteServices = HomeServeApi.fetchServices(serverUrl)
        if (remoteServices.isNotEmpty()) services = remoteServices
        bookings = HomeServeApi.fetchBookings(serverUrl)
        isOnline = true
      } catch (_: Exception) {
        isOnline = false
      }
    }
  }

  LaunchedEffect(Unit) { syncData() }

  val cartCount = cart.sumOf { it.qty }
  val cartTotal = cart.sumOf { it.service.price * it.qty }

  Scaffold(
    topBar = {
      TopAppBar(
        title = {
          Column {
            Text("HomeServe Pro", fontWeight = FontWeight.ExtraBold, fontSize = 19.sp)
            Text(
              if (isOnline) "Connected to Live Server" else "Offline Mode (Local Catalog)",
              fontSize = 11.sp,
              color = if (isOnline) Color(0xFF10B981) else Color(0xFF64748B)
            )
          }
        },
        actions = {
          TextButton(onClick = { syncData() }) {
            Text("Sync")
          }
        }
      )
    },
    bottomBar = {
      NavigationBar {
        NavigationBarItem(
          selected = selectedTab == 0,
          onClick = { selectedTab = 0 },
          icon = { Text("🏠", fontSize = 18.sp) },
          label = { Text("Services") }
        )
        NavigationBarItem(
          selected = selectedTab == 1,
          onClick = { selectedTab = 1 },
          icon = { Text("🛒", fontSize = 18.sp) },
          label = { Text("Cart ($cartCount)") }
        )
        NavigationBarItem(
          selected = selectedTab == 2,
          onClick = { selectedTab = 2; syncData() },
          icon = { Text("📋", fontSize = 18.sp) },
          label = { Text("Bookings") }
        )
      }
    }
  ) { innerPadding ->
    Box(modifier = Modifier.padding(innerPadding).fillMaxSize().background(Color(0xFFF8FAFC))) {
      when (selectedTab) {
        0 -> ServicesScreen(
          services = services,
          selectedCat = selectedCat,
          onSelectCat = { selectedCat = it },
          searchQuery = searchQuery,
          onSearchChange = { searchQuery = it },
          cart = cart,
          onAdd = { srv ->
            cart = if (cart.any { it.service.id == srv.id }) {
              cart.map { if (it.service.id == srv.id) it.copy(qty = it.qty + 1) else it }
            } else {
              cart + CartItem(srv, 1)
            }
          },
          onUpdateQty = { id, delta ->
            cart = cart.mapNotNull {
              if (it.service.id == id) {
                val nq = it.qty + delta
                if (nq > 0) it.copy(qty = nq) else null
              } else it
            }
          },
          onGoToCart = { selectedTab = 1 }
        )

        1 -> CartCheckoutScreen(
          cart = cart,
          cartTotal = cartTotal,
          statusMessage = statusMessage,
          onUpdateQty = { id, delta ->
            cart = cart.mapNotNull {
              if (it.service.id == id) {
                val nq = it.qty + delta
                if (nq > 0) it.copy(qty = nq) else null
              } else it
            }
          },
          onSubmitBooking = { name, phone, address, city, date, slot, notes ->
            scope.launch {
              try {
                val created = HomeServeApi.createBooking(serverUrl, name, phone, address, city, date, slot, notes, cart)
                bookings = listOf(created) + bookings
                cart = emptyList()
                statusMessage = "Booking ${created.bookingCode} confirmed on server!"
                isOnline = true
              } catch (_: Exception) {
                val localCode = "HS-${(1000..9999).random()}"
                val localBooking = BookingRecord(
                  bookingCode = localCode,
                  customerName = name,
                  customerPhone = phone,
                  address = address,
                  city = city,
                  scheduledDate = date,
                  scheduledSlot = slot,
                  itemsSummary = cart.joinToString(", ") { "${it.service.name} ×${it.qty}" },
                  totalAmount = cartTotal,
                  status = "pending"
                )
                bookings = listOf(localBooking) + bookings
                cart = emptyList()
                statusMessage = "Saved offline ($localCode). Connect server to sync."
              }
            }
          }
        )

        2 -> BookingsAndSettingsScreen(
          bookings = bookings,
          serverUrl = serverUrl,
          onServerUrlChange = { serverUrl = it },
          onSync = { syncData() }
        )
      }
    }
  }
}

@Composable
fun ServicesScreen(
  services: List<HomeServiceItem>,
  selectedCat: String,
  onSelectCat: (String) -> Unit,
  searchQuery: String,
  onSearchChange: (String) -> Unit,
  cart: List<CartItem>,
  onAdd: (HomeServiceItem) -> Unit,
  onUpdateQty: (String, Int) -> Unit,
  onGoToCart: () -> Unit
) {
  val filtered = remember(services, selectedCat, searchQuery) {
    services.filter { s ->
      val catOk = selectedCat == "all" || s.categoryId == selectedCat
      val q = searchQuery.trim().lowercase()
      val searchOk = q.isEmpty() || s.name.lowercase().contains(q) || s.categoryName.lowercase().contains(q)
      catOk && searchOk
    }
  }

  Column(modifier = Modifier.fillMaxSize()) {
    OutlinedTextField(
      value = searchQuery,
      onValueChange = onSearchChange,
      placeholder = { Text("Search AC, TV, Mobile, Laptop, Plumbing...") },
      singleLine = true,
      shape = RoundedCornerShape(12.dp),
      modifier = Modifier.fillMaxWidth().padding(horizontal = 14.dp, vertical = 10.dp)
    )

    LazyRow(
      contentPadding = PaddingValues(horizontal = 14.dp),
      horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
      items(FallbackCatalog.categories) { cat ->
        FilterChip(
          selected = selectedCat == cat.id,
          onClick = { onSelectCat(cat.id) },
          label = { Text(cat.name) }
        )
      }
    }

    LazyColumn(
      modifier = Modifier.weight(1f),
      contentPadding = PaddingValues(14.dp),
      verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
      items(filtered, key = { it.id }) { srv ->
        val qty = cart.find { it.service.id == srv.id }?.qty ?: 0
        Card(
          shape = RoundedCornerShape(16.dp),
          colors = CardDefaults.cardColors(containerColor = Color.White),
          elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
          modifier = Modifier.fillMaxWidth()
        ) {
          Column(modifier = Modifier.padding(16.dp)) {
            Text(srv.categoryName.uppercase(), fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFF4F46E5))
            Spacer(Modifier.height(4.dp))
            Text(srv.name, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(4.dp))
            Text("★ ${srv.rating}  •  ${srv.durationMins} mins  •  ${srv.warrantyDays}d warranty", fontSize = 12.sp, color = Color(0xFF64748B))
            Spacer(Modifier.height(6.dp))
            Text(srv.description, fontSize = 13.sp, color = Color(0xFF475569))
            Spacer(Modifier.height(12.dp))
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween,
              verticalAlignment = Alignment.CenterVertically
            ) {
              Row(verticalAlignment = Alignment.Bottom, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("₹${srv.price}", fontSize = 18.sp, fontWeight = FontWeight.ExtraBold)
                srv.originalPrice?.let {
                  Text("₹$it", fontSize = 13.sp, color = Color(0xFF94A3B8), textDecoration = TextDecoration.LineThrough)
                }
              }

              if (qty == 0) {
                Button(onClick = { onAdd(srv) }, shape = RoundedCornerShape(10.dp)) {
                  Text("+ Add")
                }
              } else {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                  OutlinedButton(onClick = { onUpdateQty(srv.id, -1) }, contentPadding = PaddingValues(horizontal = 12.dp)) { Text("-") }
                  Text("$qty", fontWeight = FontWeight.Bold)
                  OutlinedButton(onClick = { onUpdateQty(srv.id, 1) }, contentPadding = PaddingValues(horizontal = 12.dp)) { Text("+") }
                }
              }
            }
          }
        }
      }
    }

    if (cart.isNotEmpty()) {
      Surface(color = Color(0xFF4F46E5), modifier = Modifier.fillMaxWidth()) {
        Row(
          modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Text("${cart.sumOf { it.qty }} items • ₹${cart.sumOf { it.service.price * it.qty }}", color = Color.White, fontWeight = FontWeight.Bold)
          Button(
            onClick = onGoToCart,
            colors = ButtonDefaults.buttonColors(containerColor = Color.White, contentColor = Color(0xFF4F46E5))
          ) {
            Text("Proceed to Book", fontWeight = FontWeight.Bold)
          }
        }
      }
    }
  }
}

@Composable
fun CartCheckoutScreen(
  cart: List<CartItem>,
  cartTotal: Int,
  statusMessage: String?,
  onUpdateQty: (String, Int) -> Unit,
  onSubmitBooking: (String, String, String, String, String, String, String) -> Unit
) {
  var name by remember { mutableStateOf("") }
  var phone by remember { mutableStateOf("") }
  var address by remember { mutableStateOf("") }
  var city by remember { mutableStateOf("Delhi NCR") }
  var date by remember { mutableStateOf("2026-11-26") }
  var slot by remember { mutableStateOf("10:00 AM - 11:00 AM") }
  var notes by remember { mutableStateOf("") }

  LazyColumn(contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
    if (statusMessage != null) {
      item {
        Card(colors = CardDefaults.cardColors(containerColor = Color(0xFFD1FAE5)), modifier = Modifier.fillMaxWidth()) {
          Text(statusMessage, modifier = Modifier.padding(14.dp), color = Color(0xFF065F46), fontWeight = FontWeight.Bold)
        }
      }
    }

    if (cart.isEmpty()) {
      item {
        Text("Your cart is empty. Add services from the Services tab.", color = Color(0xFF64748B), modifier = Modifier.padding(top = 24.dp))
      }
    } else {
      items(cart, key = { it.service.id }) { item ->
        Card(colors = CardDefaults.cardColors(containerColor = Color.White), modifier = Modifier.fillMaxWidth()) {
          Row(
            modifier = Modifier.padding(14.dp).fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
          ) {
            Column(modifier = Modifier.weight(1f)) {
              Text(item.service.name, fontWeight = FontWeight.Bold)
              Text("₹${item.service.price} × ${item.qty}", fontSize = 13.sp, color = Color(0xFF64748B))
            }
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
              OutlinedButton(onClick = { onUpdateQty(item.service.id, -1) }) { Text("-") }
              Text("${item.qty}", fontWeight = FontWeight.Bold)
              OutlinedButton(onClick = { onUpdateQty(item.service.id, 1) }) { Text("+") }
            }
          }
        }
      }

      item {
        Card(colors = CardDefaults.cardColors(containerColor = Color.White), modifier = Modifier.fillMaxWidth()) {
          Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Text("Customer & Visit Details", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Full Name") }, modifier = Modifier.fillMaxWidth())
            OutlinedTextField(value = phone, onValueChange = { phone = it }, label = { Text("Mobile Number") }, modifier = Modifier.fillMaxWidth())
            OutlinedTextField(value = address, onValueChange = { address = it }, label = { Text("Complete Address") }, modifier = Modifier.fillMaxWidth())
            OutlinedTextField(value = city, onValueChange = { city = it }, label = { Text("City") }, modifier = Modifier.fillMaxWidth())
            OutlinedTextField(value = date, onValueChange = { date = it }, label = { Text("Date (YYYY-MM-DD)") }, modifier = Modifier.fillMaxWidth())
            OutlinedTextField(value = slot, onValueChange = { slot = it }, label = { Text("Time Slot") }, modifier = Modifier.fillMaxWidth())
            OutlinedTextField(value = notes, onValueChange = { notes = it }, label = { Text("Issue Notes (Optional)") }, modifier = Modifier.fillMaxWidth())

            Button(
              onClick = {
                if (name.isNotBlank() && phone.isNotBlank() && address.isNotBlank()) {
                  onSubmitBooking(name, phone, address, city, date, slot, notes)
                }
              },
              enabled = name.isNotBlank() && phone.isNotBlank() && address.isNotBlank(),
              modifier = Modifier.fillMaxWidth().height(48.dp)
            ) {
              Text("Confirm Booking • ₹$cartTotal", fontWeight = FontWeight.Bold)
            }
          }
        }
      }
    }
  }
}

@Composable
fun BookingsAndSettingsScreen(
  bookings: List<BookingRecord>,
  serverUrl: String,
  onServerUrlChange: (String) -> Unit,
  onSync: () -> Unit
) {
  LazyColumn(contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
    item {
      Card(colors = CardDefaults.cardColors(containerColor = Color.White), modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
          Text("Backend Server URL", fontWeight = FontWeight.Bold)
          OutlinedTextField(
            value = serverUrl,
            onValueChange = onServerUrlChange,
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
          )
          Button(onClick = onSync, modifier = Modifier.align(Alignment.End)) {
            Text("Connect & Refresh")
          }
        }
      }
    }

    item {
      Text("Recent Bookings (${bookings.size})", fontWeight = FontWeight.Bold, fontSize = 16.sp)
    }

    items(bookings) { b ->
      Card(colors = CardDefaults.cardColors(containerColor = Color.White), modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
          Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text("${b.bookingCode} • ${b.customerName}", fontWeight = FontWeight.Bold)
            Text(b.status.uppercase(), fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color(0xFF4F46E5))
          }
          Text(b.itemsSummary, fontSize = 13.sp, color = Color(0xFF475569))
          Text("${b.scheduledDate} • ${b.scheduledSlot} • ₹${b.totalAmount}", fontSize = 12.sp, color = Color(0xFF64748B))
          b.technicianName?.let {
            Text("Assigned Pro: $it", fontSize = 12.sp, color = Color(0xFF10B981), fontWeight = FontWeight.SemiBold)
          }
        }
      }
    }
  }
}
