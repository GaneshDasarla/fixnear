// use fixnear

db.providers.insertMany([
  { name: "John Smith", service: "Plumbing", location: "New York", available: true, rating: 4.8, price: 50 },
  { name: "Jane Doe", service: "Electrical", location: "New York", available: true, rating: 4.9, price: 60 },
  { name: "Mike Johnson", service: "Mechanic", location: "Boston", available: true, rating: 4.7, price: 55 },
  { name: "Sarah Williams", service: "Painting", location: "Boston", available: true, rating: 4.6, price: 40 },
  { name: "Robert Brown", service: "HVAC", location: "New York", available: true, rating: 4.5, price: 75 },
  { name: "Emily Davis", service: "General Repair", location: "Chicago", available: true, rating: 4.9, price: 45 },
  { name: "David Wilson", service: "Roofing", location: "Chicago", available: true, rating: 4.7, price: 90 },
  { name: "Lisa Anderson", service: "Security", location: "Boston", available: false, rating: 4.8, price: 85 },
  { name: "James Martinez", service: "Plumbing", location: "Chicago", available: true, rating: 4.6, price: 50 },
  { name: "Patricia Taylor", service: "Electrical", location: "Boston", available: true, rating: 4.9, price: 60 }
])

print("✅ Providers inserted successfully!")
