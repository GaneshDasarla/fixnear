package com.fixnear.repository;

import com.fixnear.model.Provider;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProviderRepository
        extends MongoRepository<Provider, String> {

    List<Provider> findByServiceIgnoreCase(String service);
    
    List<Provider> findByAvailableTrue();
    
    List<Provider> findByLocationIgnoreCase(String location);
    
    List<Provider> findByServiceIgnoreCaseAndLocationIgnoreCase(String service, String location);
    java.util.Optional<Provider> findByUserId(String userId);
}
