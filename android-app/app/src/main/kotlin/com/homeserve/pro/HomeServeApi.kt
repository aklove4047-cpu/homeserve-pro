package com.homeserve.pro

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

object HomeServeApi {
  suspend fun fetchServices(baseUrl: String): List<HomeServiceItem> = withContext(Dispatchers.IO) {
    val conn = (URL("${baseUrl.trimEnd('/')}/api/services").openConnection() as HttpURLConnection).apply {
      connectTimeout = 3500
      readTimeout = 3500
      requestMethod = "GET"
    }
    try {
      if (conn.responseCode != 200) throw Exception("HTTP ${conn.responseCode}")
      val text = conn.inputStream.bufferedReader().readText()
      val arr = JSONArray(text)
      buildList {
        for (i in 0 until arr.length()) {
          val o = arr.getJSONObject(i)
          add(
            HomeServiceItem(
              id = o.getString("id"),
              categoryId = o.getString("category_id"),
              categoryName = o.optString("category_name", "Service"),
              name = o.getString("name"),
              description = o.optString("description", ""),
              price = o.getInt("price"),
              originalPrice = if (o.isNull("original_price")) null else o.optInt("original_price"),
              durationMins = o.optInt("duration_mins", 45),
              rating = o.optDouble("rating", 4.8),
              warrantyDays = o.optInt("warranty_days", 30)
            )
          )
        }
      }
    } finally {
      conn.disconnect()
    }
  }

  suspend fun fetchBookings(baseUrl: String): List<BookingRecord> = withContext(Dispatchers.IO) {
    val conn = (URL("${baseUrl.trimEnd('/')}/api/bookings").openConnection() as HttpURLConnection).apply {
      connectTimeout = 3500
      readTimeout = 3500
      requestMethod = "GET"
    }
    try {
      if (conn.responseCode != 200) throw Exception("HTTP ${conn.responseCode}")
      val text = conn.inputStream.bufferedReader().readText()
      val arr = JSONArray(text)
      buildList {
        for (i in 0 until arr.length()) {
          val o = arr.getJSONObject(i)
          val items = o.optJSONArray("items") ?: JSONArray()
          val summary = buildList {
            for (j in 0 until items.length()) {
              val it = items.getJSONObject(j)
              add("${it.optString("name")} ×${it.optInt("qty", 1)}")
            }
          }.joinToString(", ")
          add(
            BookingRecord(
              bookingCode = o.optString("booking_code", "HS-0000"),
              customerName = o.optString("customer_name", ""),
              customerPhone = o.optString("customer_phone", ""),
              address = o.optString("address", ""),
              city = o.optString("city", ""),
              scheduledDate = o.optString("scheduled_date", ""),
              scheduledSlot = o.optString("scheduled_slot", ""),
              itemsSummary = summary,
              totalAmount = o.optInt("total_amount", 0),
              status = o.optString("status", "pending"),
              technicianName = if (o.isNull("technician_name")) null else o.optString("technician_name")
            )
          )
        }
      }
    } finally {
      conn.disconnect()
    }
  }

  suspend fun createBooking(
    baseUrl: String,
    name: String,
    phone: String,
    address: String,
    city: String,
    date: String,
    slot: String,
    notes: String,
    cart: List<CartItem>
  ): BookingRecord = withContext(Dispatchers.IO) {
    val itemsArr = JSONArray().apply {
      cart.forEach {
        put(JSONObject().apply {
          put("id", it.service.id)
          put("name", it.service.name)
          put("price", it.service.price)
          put("qty", it.qty)
        })
      }
    }
    val payload = JSONObject().apply {
      put("customer_name", name)
      put("customer_phone", phone)
      put("address", address)
      put("city", city)
      put("scheduled_date", date)
      put("scheduled_slot", slot)
      put("notes", notes)
      put("items", itemsArr)
      put("source", "android")
    }

    val conn = (URL("${baseUrl.trimEnd('/')}/api/bookings").openConnection() as HttpURLConnection).apply {
      connectTimeout = 4000
      readTimeout = 4000
      requestMethod = "POST"
      doOutput = true
      setRequestProperty("Content-Type", "application/json")
    }
    try {
      OutputStreamWriter(conn.outputStream).use { it.write(payload.toString()) }
      if (conn.responseCode !in 200..299) throw Exception("HTTP ${conn.responseCode}")
      val res = JSONObject(conn.inputStream.bufferedReader().readText())
      BookingRecord(
        bookingCode = res.optString("booking_code", "HS-NEW"),
        customerName = name,
        customerPhone = phone,
        address = address,
        city = city,
        scheduledDate = date,
        scheduledSlot = slot,
        itemsSummary = cart.joinToString(", ") { "${it.service.name} ×${it.qty}" },
        totalAmount = res.optInt("total_amount", cart.sumOf { it.service.price * it.qty }),
        status = res.optString("status", "pending")
      )
    } finally {
      conn.disconnect()
    }
  }
}
