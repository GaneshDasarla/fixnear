package com.fixnear.service;

import com.fixnear.model.Provider;
import com.fixnear.repository.ProviderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProviderService {

    private final ProviderRepository providerRepository;

    public ProviderService(ProviderRepository providerRepository) {
        this.providerRepository = providerRepository;
    }

    public List<Provider> getAllProviders() {
        return providerRepository.findAll();
    }

    public Optional<Provider> getProviderById(String id) {
        return providerRepository.findById(id);
    }

    public java.util.Optional<Provider> getProviderByUserId(String userId) {
        return providerRepository.findByUserId(userId);
    }

    public List<Provider> getProvidersByService(String service) {
        return providerRepository.findByServiceIgnoreCase(service);
    }

    public List<Provider> getProvidersByLocation(String location) {
        return providerRepository.findByLocationIgnoreCase(location);
    }

    public List<Provider> searchProviders(String service, String location) {
        // If both service and location provided
        if (service != null && !service.trim().isEmpty() && 
            location != null && !location.trim().isEmpty()) {
            return providerRepository.findByServiceIgnoreCaseAndLocationIgnoreCase(service, location);
        }
        // If only service provided
        else if (service != null && !service.trim().isEmpty()) {
            return providerRepository.findByServiceIgnoreCase(service);
        }
        // If only location provided
        else if (location != null && !location.trim().isEmpty()) {
            return providerRepository.findByLocationIgnoreCase(location);
        }
        // If neither provided, return all
        return providerRepository.findAll();
    }

    @SuppressWarnings("null")
    public Provider saveProvider(Provider provider) {
        return providerRepository.save(provider);
    }

    @SuppressWarnings("null")
    public Provider updateProvider(String id, Provider updatedProvider) {
        return providerRepository.findById(id)
                .map(provider -> {
                    provider.setName(updatedProvider.getName());
                    provider.setService(updatedProvider.getService());
                    provider.setLocation(updatedProvider.getLocation());
                    provider.setAvailable(updatedProvider.isAvailable());
                    // allow linking provider to a user account
                    if (updatedProvider.getUserId() != null) {
                        provider.setUserId(updatedProvider.getUserId());
                    }
                    provider.setWorkingHours(updatedProvider.getWorkingHours());
                    provider.setPrice(updatedProvider.getPrice());
                    return providerRepository.save(provider);
                })
                .orElseThrow(() -> new RuntimeException("Provider not found"));
    }

    public void deleteProvider(String id) {
        providerRepository.deleteById(id);
    }

    public List<Provider> getAvailableProviders() {
        return providerRepository.findByAvailableTrue();
    }

    @SuppressWarnings("null")
    public Provider updateProviderRating(String id, double newRating) {
        return providerRepository.findById(id)
                .map(provider -> {
                    provider.setRating(newRating);
                    return providerRepository.save(provider);
                })
                .orElseThrow(() -> new RuntimeException("Provider not found"));
    }
}
