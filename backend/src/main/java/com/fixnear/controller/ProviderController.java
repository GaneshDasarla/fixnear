package com.fixnear.controller;

import com.fixnear.model.Provider;
import com.fixnear.service.ProviderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("providers")
@CrossOrigin(origins = "http://localhost:3000")
public class ProviderController {

    private final ProviderService providerService;

    public ProviderController(ProviderService providerService) {
        this.providerService = providerService;
    }

    // ✅ GET ALL PROVIDERS OR FILTER BY SERVICE
    @GetMapping
    public ResponseEntity<?> getProviders(
            @RequestParam(required = false) String service,
            @RequestParam(required = false) String location
    ) {
        try {
            // Use search method to handle all combinations
            return ResponseEntity.ok(providerService.searchProviders(service, location));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving providers: " + e.getMessage());
        }
    }

    // ✅ GET AVAILABLE PROVIDERS
    @GetMapping("/available")
    public ResponseEntity<?> getAvailableProviders() {
        try {
            return ResponseEntity.ok(providerService.getAvailableProviders());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving available providers: " + e.getMessage());
        }
    }

    // ✅ SEARCH BY LOCATION
    @GetMapping("/location/{location}")
    public ResponseEntity<?> getProvidersByLocation(@PathVariable String location) {
        try {
            return ResponseEntity.ok(providerService.getProvidersByLocation(location));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving providers by location: " + e.getMessage());
        }
    }

    // ✅ GET PROVIDER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getProviderById(@PathVariable String id) {
        try {
            return providerService.getProviderById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving provider: " + e.getMessage());
        }
    }

    // ✅ GET PROVIDER BY USER ID (for provider dashboard linking)
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getProviderByUserId(@PathVariable String userId) {
        try {
            return providerService.getProviderByUserId(userId)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving provider by userId: " + e.getMessage());
        }
    }

    // ✅ ADD/CREATE PROVIDER (For Admin or Provider Registration)
    @PostMapping
    public ResponseEntity<?> addProvider(@RequestBody Provider provider) {
        try {
            if (provider.getName() == null || provider.getName().isEmpty()) {
                return ResponseEntity.badRequest().body("Provider name is required");
            }
            if (provider.getService() == null || provider.getService().isEmpty()) {
                return ResponseEntity.badRequest().body("Service type is required");
            }

            Provider savedProvider = providerService.saveProvider(provider);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProvider);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating provider: " + e.getMessage());
        }
    }

    // ✅ UPDATE PROVIDER (Provider can update their own profile, Admin can update any)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProvider(@PathVariable String id, @RequestBody Provider provider) {
        try {
            Provider updatedProvider = providerService.updateProvider(id, provider);
            return ResponseEntity.ok(updatedProvider);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating provider: " + e.getMessage());
        }
    }

    // ✅ UPDATE PROVIDER AVAILABILITY
    @PutMapping("/{id}/availability")
    public ResponseEntity<?> updateAvailability(@PathVariable String id, @RequestParam boolean available) {
        try {
            return providerService.getProviderById(id)
                    .map(provider -> {
                        provider.setAvailable(available);
                        Provider updated = providerService.saveProvider(provider);
                        return ResponseEntity.ok(updated);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating availability: " + e.getMessage());
        }
    }

    // ✅ DELETE PROVIDER (Admin only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProvider(@PathVariable String id) {
        try {
            providerService.deleteProvider(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting provider: " + e.getMessage());
        }
    }

    // ✅ UPDATE PROVIDER RATING (Called after booking completion and review)
    @PutMapping("/{id}/rating")
    public ResponseEntity<?> updateProviderRating(@PathVariable String id, @RequestParam double newRating) {
        try {
            Provider updated = providerService.updateProviderRating(id, newRating);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating rating: " + e.getMessage());
        }
    }
}
