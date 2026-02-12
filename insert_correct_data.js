// use fixnear
db.providers.deleteMany({});

db.providers.insertMany([
  { name: "John Smith", service: "Plumbing", location: "New York", available: true, rating: 4.8, price: 50, workingHours: "9AM-6PM" },
  { name: "Jane Doe", service: "Electrical", location: "New York", available: true, rating: 4.9, price: 60, workingHours: "9AM-6PM" },
  { name: "Mike Johnson", service: "Mechanic", location: "Boston", available: true, rating: 4.7, price: 55, workingHours: "8AM-5PM" },
  { name: "Sarah Williams", service: "Painting", location: "Boston", available: true, rating: 4.6, price: 40, workingHours: "10AM-4PM" },
  { name: "Robert Brown", service: "HVAC", location: "New York", available: true, rating: 4.5, price: 75, workingHours: "8AM-5PM" },
  { name: "Emily Davis", service: "General Repair", location: "Chicago", available: true, rating: 4.9, price: 45, workingHours: "9AM-6PM" },
  { name: "David Wilson", service: "Roofing", location: "Chicago", available: true, rating: 4.7, price: 90, workingHours: "7AM-4PM" },
  { name: "Lisa Anderson", service: "Security", location: "Boston", available: true, rating: 4.8, price: 85, workingHours: "24/7" },
  { name: "James Martinez", service: "Plumbing", location: "Chicago", available: true, rating: 4.6, price: 50, workingHours: "9AM-6PM" },
  { name: "Patricia Taylor", service: "Electrical", location: "Boston", available: true, rating: 4.9, price: 60, workingHours: "9AM-6PM" }
]);

print("✅ Test data inserted successfully!")
